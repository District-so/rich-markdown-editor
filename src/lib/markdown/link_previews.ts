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
	        	const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
            const id = insideLink.attrs[1][1];
            const subtitle = insideLink.attrs[2][1];
            const image = insideLink.attrs[3][1];
            const event_day = insideLink.attrs.length > 4 ? insideLink.attrs[4][1] : null;
            const event_month = insideLink.attrs.length > 5 ? insideLink.attrs[5][1] : null;
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
            break;
	        }
	      }
	    //}

    }

    return false;
  });
}
