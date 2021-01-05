import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";

const LINK_PREVIEW_REGEX = /\{((?:\[(?<title>.*?)\]),\s?(?:\[(?<subtitle>.*?)\]),\s?(?:\[(?<image>.*?)\])\s?.*)\}/i;

function isLinkPreview(token: Token) {
  return LINK_PREVIEW_REGEX.exec(token.content);
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

export default function markdownItLinkPreview(md: MarkdownIt): void {
  // insert a new rule after the "inline" rules are parsed
  md.core.ruler.after("inline", "link_with_preview", state => {
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

          const result = isLinkPreview(current);
	        if(result){
	        	const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
	        	const token = new Token("link_with_preview", "a", 0);
            token.attrSet("href", href);
            // @ts-ignore
            token.attrSet("title", result.groups.title);
            // @ts-ignore
            token.attrSet("subtitle", result.groups.subtitle);
            // @ts-ignore
            token.attrSet("image", result.groups.image);
            tokens.splice(i - 1, 3, token);
            break;
	        }
	      }
	    }

    }

    return false;
  });
}
