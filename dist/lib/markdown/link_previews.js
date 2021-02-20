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
function markdownItLinkPreview(md) {
    md.core.ruler.push("link_with_preview", state => {
        const tokens = state.tokens;
        let insideLink;
        for (let i = tokens.length - 1; i > 0; i--) {
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
                if (current.content && insideLink && insideLink.attrs && insideLink.attrs.length > 1 && insideLink.attrs[1][0] == 'id') {
                    let href = "";
                    let id = null;
                    let subtitle = null;
                    let image = null;
                    let event_day = null;
                    let event_month = null;
                    for (const attr of insideLink.attrs) {
                        if (attr[0] == 'href') {
                            href = attr[1];
                        }
                        if (attr[0] == 'id') {
                            id = attr[1];
                        }
                        if (attr[0] == 'subtitle') {
                            subtitle = attr[1];
                        }
                        if (attr[0] == 'image') {
                            image = attr[1];
                        }
                        if (attr[0] == 'event_day') {
                            event_day = attr[1];
                        }
                        if (attr[0] == 'event_month') {
                            event_month = attr[1];
                        }
                    }
                    const token = new token_1.default("link_with_preview", "a", 0);
                    token.attrSet("href", href);
                    token.attrSet("id", id);
                    token.attrSet("title", current.content);
                    token.attrSet("subtitle", subtitle);
                    token.attrSet("image", image);
                    if (event_day && event_month) {
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
        }
        return false;
    });
}
exports.default = markdownItLinkPreview;
//# sourceMappingURL=link_previews.js.map