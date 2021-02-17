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
                id: {
                    default: "",
                },
                subtitle: {
                    default: "",
                },
                image: {
                    default: "",
                },
                event_obj: {
                    default: null,
                }
            },
            content: "inline*",
            group: "block",
            inclusive: false,
            draggable: true,
            parseDOM: [
                {
                    tag: "a.post-card",
                    priority: 55,
                    getAttrs: (dom) => {
                        let imgSrc = null;
                        if (dom.getElementsByTagName("img") && dom.getElementsByTagName("img").length) {
                            imgSrc = dom.getElementsByTagName("img")[0].getAttribute("src");
                        }
                        const title = dom.getElementsByClassName("title")[0];
                        let subtitle = '';
                        if (dom.getElementsByClassName("subtitle") && dom.getElementsByClassName("subtitle").length) {
                            subtitle = dom.getElementsByClassName("subtitle")[0].innerText;
                        }
                        const eventDay = dom.getElementsByClassName("event-day")[0];
                        const eventMonth = dom.getElementsByClassName("event-month")[0];
                        let eventObj = null;
                        if (eventDay && eventDay.innerText) {
                            eventObj = {
                                day: eventDay.innerText,
                                month: eventMonth.innerText
                            };
                        }
                        return {
                            href: dom.getAttribute("href"),
                            id: dom.getAttribute("data-id"),
                            title: title.innerText,
                            subtitle: subtitle,
                            image: imgSrc,
                            event_obj: eventObj,
                        };
                    },
                },
            ],
            toDOM: node => {
                const title = document.createElement("div");
                title.innerHTML = node.attrs.title;
                title.className = "title";
                const subtitle = document.createElement("p");
                subtitle.innerHTML = node.attrs.subtitle;
                subtitle.className = 'subtitle';
                var result = [
                    "a",
                    {
                        'data-id': node.attrs.id,
                        href: node.attrs.href,
                        rel: "noopener noreferrer nofollow",
                        class: "post-card card"
                    },
                ];
                if (node.attrs.image) {
                    const image = document.createElement("img");
                    image.src = node.attrs.image;
                    image.className = 'post-image';
                    result.push(image);
                }
                if (node.attrs.event_obj && node.attrs.event_obj.day && node.attrs.event_obj.month) {
                    const day = document.createElement("label");
                    day.innerHTML = node.attrs.event_obj.day;
                    day.className = "event-day text-primary";
                    const month = document.createElement("label");
                    month.innerHTML = node.attrs.event_obj.month;
                    month.className = "event-month text-uppercase mb-1 text-sm";
                    result.push(["div",
                        { class: "post-text-content" },
                        [
                            "div",
                            { class: "d-flex post-event-title" },
                            [
                                "div",
                                { class: "event-block alert bg-light text-center px-2 pt-1 pb-0 mr-3 mb-0" },
                                month,
                                day,
                            ],
                            title,
                        ],
                        subtitle
                    ]);
                }
                else {
                    result.push(["div", { class: "post-text-content" }, title, subtitle]);
                }
                return result;
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
        if (node.attrs.event_obj && node.attrs.event_obj.day && node.attrs.event_obj.month) {
            state.write("[" + node.attrs.title + "](" + node.attrs.href + "){id=" + node.attrs.id + " subtitle=\"" + node.attrs.subtitle + "\" image=\"" + node.attrs.image + "\" event_day=" + node.attrs.event_obj.day + " event_month=" + node.attrs.event_obj.month + "}");
        }
        else if (node.attrs.image) {
            state.write("[" + node.attrs.title + "](" + node.attrs.href + "){id=" + node.attrs.id + " subtitle=\"" + node.attrs.subtitle + "\" image=\"" + node.attrs.image + "\"}");
        }
        else {
            state.write("[" + node.attrs.title + "](" + node.attrs.href + "){id=" + node.attrs.id + " subtitle=\"" + node.attrs.subtitle + "\"}");
        }
        state.write("\n\n");
    }
    parseMarkdown() {
        return {
            node: "link_with_preview",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null,
                id: tok.attrGet("id") || null,
                subtitle: tok.attrGet("subtitle") || null,
                image: tok.attrGet("image") || null,
                event_obj: tok.attrGet("event_obj") || null,
            }),
        };
    }
}
exports.default = LinkPreview;
//# sourceMappingURL=LinkPreview.js.map