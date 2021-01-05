"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("markdown-it/lib/token"));
const BUTTON_REGEX = /\{(?<title>.*?)\}{(?<style>.*?)\}/i;
function isButton(token) {
    return BUTTON_REGEX.exec(token.content);
}
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
    md.core.ruler.after("inline", "button", state => {
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
                    const result = isButton(current);
                    if (result) {
                        const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
                        const token = new token_1.default("button", "a", 0);
                        token.content = result.groups.title;
                        token.attrSet("title", result.groups.title);
                        token.attrSet("href", href);
                        token.attrSet("style", result.groups.style);
                        const tokenChildren = new token_1.default("text", "", 0);
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
exports.default = markdownItButton;
//# sourceMappingURL=buttons.js.map