"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("markdown-it/lib/token"));
const LINK_PREVIEW_REGEX = /\{((?:\[(?<id>.*?)\]),\s?(?:\[(?<title>.*?)\]),\s?(?:\[(?<subtitle>.*?)\]),\s?(?:\[(?<image>.*?)\])(,\s?(?:\[(?<event_day>.*?)\]),\s?(?:\[(?<event_month>.*?)\]))?\s?.*)\}/i;
function isLinkPreview(token) {
    return LINK_PREVIEW_REGEX.exec(token.content);
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
function markdownItLinkPreview(md) {
    md.core.ruler.after("inline", "link_with_preview", state => {
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
                    const result = isLinkPreview(current);
                    if (result) {
                        const href = insideLink.attrs ? insideLink.attrs[0][1] : "";
                        const token = new token_1.default("link_with_preview", "a", 0);
                        token.attrSet("href", href);
                        token.attrSet("id", result.groups.id);
                        token.attrSet("title", result.groups.title);
                        token.attrSet("subtitle", result.groups.subtitle);
                        token.attrSet("image", result.groups.image);
                        if (result.groups.event_day && result.groups.event_month) {
                            token.attrSet("event", {
                                day: result.groups.event_day,
                                month: result.groups.event_month
                            });
                        }
                        tokens.splice(i - 1, 3, token);
                        break;
                    }
                }
            }
        }
        return false;
    });
}
exports.default = markdownItLinkPreview;
//# sourceMappingURL=link_previews.js.map