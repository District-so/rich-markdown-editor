import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";


function isInline(token: Token): boolean {
  return token.type === "inline";
}

function isParagraph(token: Token): boolean {
  return token.type === "paragraph_open";
}

function isLinkOpen(token: Token) {
  return token.type === "link_open";
}

function isLinkClose(token: Token) {
  return token.type === "link_close";
}

export default function markdownItLinkPreview(md: MarkdownIt): void {
  // insert a new rule after the "inline" rules are parsed
  md.core.ruler.push("link_with_preview", state => {
    const tokens = state.tokens;
    let insideLink;
    // work backwards through the tokens and find text that looks like a checkbox
    for (let i = tokens.length - 1; i > 0; i--) {
     	// once we find an inline token look through it's children for links
	    //if (isInline(tokens[i]) && isParagraph(tokens[i - 1])) {
	      const tokenChildren = tokens[i].children || [];

	      for (let j = 0; j < tokenChildren.length - 1; j++) {
	        const current = tokenChildren[j];
	        if (!current) continue;
	        if (isLinkOpen(current)) {
            insideLink = current;
            continue;
          }

          if (isLinkClose(current)) {
            insideLink = null;
            continue;
          }

          if(current.content && insideLink && insideLink.attrs && insideLink.attrs.length > 1 && insideLink.attrs[1][0] == 'id'){
	        	let href = "";
            let id = null;
            let subtitle = null;
            let image = null;
            let event_day = null;
            let event_month = null;
            for(const attr of insideLink.attrs){
              if(attr[0] == 'href'){
                href = attr[1];
              }
              if(attr[0] == 'id'){
                id = attr[1];
              }
              if(attr[0] == 'subtitle'){
                subtitle = attr[1];
              }
              if(attr[0] == 'image'){
                image = attr[1];
              }
              if(attr[0] == 'event_day'){
                event_day = attr[1];
              }
              if(attr[0] == 'event_month'){
                event_month = attr[1];
              }
            }
	        	
            const token = new Token("link_with_preview", "a", 0);
            token.attrSet("href", href);
            token.attrSet("id", id);
            token.attrSet("title", current.content);
            token.attrSet("subtitle", subtitle);
            token.attrSet("image", image);
            if(event_day && event_month){
              token.attrSet("event_obj", {
                day: event_day,
                month: event_month
              });
            }
            tokens.splice(i - 1, 3, token);
            insideLink = null;
            break;
	        }
	      }
	    //}

    }

    return false;
  });
}
