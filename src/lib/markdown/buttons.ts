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

export default function markdownItButton(md: MarkdownIt): void {
  // insert a new rule after the "inline" rules are parsed
  md.core.ruler.push("button", state => {
    const tokens = state.tokens;
    let insideLink;
    // work backwards through the tokens and find text that looks like a checkbox
    for (let i = tokens.length - 1; i > 0; i--) {
     	// once we find an inline token look through it's children for links
	    if (isInline(tokens[i]) && isParagraph(tokens[i - 1])) {
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

	        if(current.content && insideLink && insideLink.attrs && insideLink.attrs.length > 1 && insideLink.attrs[1][0] == 'style'){
            const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
            const style = insideLink.attrs[1][1];
	        	const token = new Token("button", "a", 0);
            token.content = current.content;
            token.attrSet("title", current.content);
            token.attrSet("href", href);
            token.attrSet("style", style);
            const tokenChildren = new Token("text", "", 0);
            tokenChildren.content = current.content;
            token.children = [tokenChildren];
            tokens.splice(i - 1, 3, token);
            insideLink = null;
            break;
	        }
	      }
	    }

    }

    return false;
  });
}
