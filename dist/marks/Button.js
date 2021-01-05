"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const Mark_1 = __importDefault(require("./Mark"));
const BUTTON_INPUT_REGEX = /\{\[(.+)\],\s?\[(.*)\],\s?\[(.*)\]\}\((\S+)\)/;
function isPlainURL(link, parent, index, side) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
        return false;
    }
    const content = parent.child(index + (side < 0 ? -1 : 0));
    if (!content.isText ||
        content.text !== link.attrs.href ||
        content.marks[content.marks.length - 1] !== link) {
        return false;
    }
    if (index === (side < 0 ? 1 : parent.childCount - 1)) {
        return true;
    }
    const next = parent.child(index + (side < 0 ? -2 : 1));
    return !link.isInSet(next.marks);
}
class Button extends Mark_1.default {
    constructor() {
        super(...arguments);
        this.handleStyleChange = event => {
            const { view } = this.editor;
            const { tr } = view.state;
            const element = event.target;
            const { top, left } = element.getBoundingClientRect();
            const result = view.posAtCoords({ top, left });
            if (result) {
                const transaction = tr.setNodeMarkup(result.inside, undefined, {
                    style: element.value,
                });
                view.dispatch(transaction);
            }
        };
    }
    get styleOptions() {
        return Object.entries({
            primary: this.options.dictionary.primary,
            secondary: this.options.dictionary.secondary,
            success: this.options.dictionary.success,
            warning: this.options.dictionary.warning,
            danger: this.options.dictionary.danger,
            info: this.options.dictionary.info,
            white: this.options.dictionary.white,
            light: this.options.dictionary.light,
            dark: this.options.dictionary.dark,
        });
    }
    get name() {
        return "button";
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
                style: {
                    default: "primary",
                },
            },
            inclusive: false,
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs: (dom) => ({
                        href: dom.getAttribute("href"),
                        title: dom.getAttribute("title"),
                        style: dom.getAttribute("subtitle"),
                    }),
                },
            ],
            toDOM: node => {
                const select = document.createElement("select");
                select.addEventListener("change", this.handleStyleChange);
                this.styleOptions.forEach(([key, label]) => {
                    const option = document.createElement("option");
                    option.value = key;
                    option.innerText = label;
                    option.selected = node.attrs.style === key;
                    select.appendChild(option);
                });
                return [
                    "a",
                    Object.assign(Object.assign({}, node.attrs), { rel: "noopener noreferrer nofollow", class: `btn btn-${node.attrs.style}` }),
                    0,
                ];
            },
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(BUTTON_INPUT_REGEX, (state, match, start, end) => {
                const [okay, title, subtitle, image, href] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start, end, this.editor.schema.text(alt)).addMark(start, start + alt.length, type.create({ href }));
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
    get toMarkdown() {
        return {
            open(_state, mark, parent, index) {
                return isPlainURL(mark, parent, index, 1) ? "<" : "[";
            },
            close(state, mark, parent, index) {
                return isPlainURL(mark, parent, index, -1)
                    ? ">"
                    : "](" +
                        state.esc(mark.attrs.href) +
                        (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") +
                        ")";
            },
        };
    }
    parseMarkdown() {
        return {
            mark: "button",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                style: tok.attrGet("style") || null,
                title: tok.attrGet("title") || null,
            }),
        };
    }
}
exports.default = Button;
//# sourceMappingURL=Button.js.map