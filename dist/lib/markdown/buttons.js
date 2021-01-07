"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("markdown-it/lib/token"));
function isInline(token) {
    return token.type === "inline";
}
function isParagraph(token) {
    return token.type === "paragraph_open";
}
function isLinkOpen(token) {
    return token.type === "link_open";
}
function isLinkClose(token) {
    return token.type === "link_close";
}
function markdownItButton(md) {
    md.core.ruler.push("button", state => {
        const tokens = state.tokens;
        let insideLink;
        for (let i = tokens.length - 1; i > 0; i--) {
            if (isInline(tokens[i]) && isParagraph(tokens[i - 1])) {
                const tokenChildren = tokens[i].children || [];
                for (let j = 0; j < tokenChildren.length - 1; j++) {
                    const current = tokenChildren[j];
                    if (!current)
                        continue;
                    if (isLinkOpen(current)) {
                        insideLink = current;
                        continue;
                    }
                    if (isLinkClose(current)) {
                        insideLink = null;
                        continue;
                    }
                    if (current.content && insideLink && insideLink.attrs && insideLink.attrs.length > 1 && insideLink.attrs[1][0] == 'style') {
                        const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
                        const style = insideLink.attrs[1][1];
                        "primary";
                        const token = new token_1.default("button", "a", 0);
                        token.content = current.content;
                        token.attrSet("title", current.content);
                        token.attrSet("href", href);
                        token.attrSet("style", style);
                        const tokenChildren = new token_1.default("text", "", 0);
                        tokenChildren.content = current.content;
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
exports.default = markdownItButton;
//# sourceMappingURL=buttons.js.map