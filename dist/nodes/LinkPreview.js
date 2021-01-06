"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const Node_1 = __importDefault(require("./Node"));
const LINK_PREVIEW_INPUT_REGEX = /\[\{\[(.+)\],\s?\[(.*)\],\s?\[(.*)\]\}\]\((\S+)\)/;
class LinkPreview extends Node_1.default {
    get name() {
        return "link_with_preview";
    }
    get schema() {
        return {
            attrs: {
                href: {
                    default: "",
                },
                title: {
                    default: "",
                },
                subtitle: {
                    default: "",
                },
                image: {
                    default: "",
                },
            },
            content: "inline*",
            group: "block",
            inclusive: false,
            draggable: true,
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs: (dom) => ({
                        href: dom.getAttribute("href"),
                        title: dom.getAttribute("title"),
                        subtitle: dom.getAttribute("subtitle"),
                        image: dom.getAttribute("image"),
                    }),
                },
            ],
            toDOM: node => {
                const title = document.createElement("div");
                title.innerHTML = node.attrs.title;
                title.className = "title";
                const subtitle = document.createElement("p");
                subtitle.innerHTML = node.attrs.subtitle;
                subtitle.className = 'subtitle';
                if (node.attrs.image) {
                    const image = document.createElement("img");
                    image.src = node.attrs.image;
                    image.className = 'post-image';
                    return [
                        "a",
                        {
                            href: node.attrs.href,
                            rel: "noopener noreferrer nofollow",
                            class: "card post-card"
                        },
                        image,
                        ["div", { class: "post-text-content" }, title, subtitle],
                    ];
                }
                else {
                    return [
                        "a",
                        {
                            href: node.attrs.href,
                            rel: "noopener noreferrer nofollow",
                            class: "card post-card"
                        },
                        title,
                        subtitle,
                    ];
                }
            },
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(LINK_PREVIEW_INPUT_REGEX, (state, match, start, end) => {
                const [okay, title, subtitle, image, href] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start, end, this.editor.schema.text(title)).addMark(start, start + title.length, type.create({ href }));
                }
                return tr;
            }),
        ];
    }
    commands({ type }) {
        return ({ href } = { href: "" }) => prosemirror_commands_1.toggleMark(type, { href });
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            if (event.target instanceof HTMLAnchorElement &&
                                !event.target.className.includes("ProseMirror-widget")) {
                                if (this.options.onHoverLink) {
                                    return this.options.onHoverLink(event);
                                }
                            }
                            return false;
                        },
                        click: (view, event) => {
                            if (view.props.editable &&
                                view.props.editable(view.state) &&
                                !event.metaKey) {
                                return false;
                            }
                            if (event.target instanceof HTMLAnchorElement) {
                                const href = event.target.href ||
                                    (event.target.parentNode instanceof HTMLAnchorElement
                                        ? event.target.parentNode.href
                                        : "");
                                const isHashtag = href.startsWith("#");
                                if (isHashtag && this.options.onClickHashtag) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.options.onClickHashtag(href, event);
                                    return true;
                                }
                                if (this.options.onClickLink) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.options.onClickLink(href, event);
                                    return true;
                                }
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    }
    toMarkdown(state, node) {
        state.ensureNewLine();
        state.write("[{[" + node.attrs.title + "], [" + node.attrs.subtitle + "], [" + node.attrs.image + "]}](" + node.attrs.href + ")");
        state.write("\n\n");
    }
    parseMarkdown() {
        return {
            node: "link_with_preview",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null,
                subtitle: tok.attrGet("subtitle") || null,
                image: tok.attrGet("image") || null,
            }),
        };
    }
}
exports.default = LinkPreview;
//# sourceMappingURL=LinkPreview.js.map