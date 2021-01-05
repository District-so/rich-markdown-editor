import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

const BUTTON_REGEX = /\{(?<title>.*?)\}{(?<style>.*?)\}/i;

function isButton(token: Token) {
  return BUTTON_REGEX.exec(token.content);
}

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
  md.core.ruler.after("inline", "button", state => {
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

          const result = isButton(current);
	        if(result){
            const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
	        	const token = new Token("button", "a", 0);
            // @ts-ignore
            token.content = result.groups.title;
            // @ts-ignore
            token.attrSet("title", result.groups.title);
            token.attrSet("href", href);
            // @ts-ignore
            token.attrSet("style", result.groups.style);
            const tokenChildren = new Token("text", "", 0);
            // @ts-ignore
            tokenChildren.content = result.groups.title;
            token.children = [tokenChildren];
            tokens.splice(i - 1, 3, token);
            break;
	        }
	      }
	    }

    }

    return false;
  });
}
