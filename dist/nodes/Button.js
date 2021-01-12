"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const Node_1 = __importDefault(require("./Node"));
const prosemirror_utils_1 = require("prosemirror-utils");
const styled_components_1 = __importDefault(require("styled-components"));
const BUTTON_INPUT_REGEX = /\[\{(.+)\}\{(.+)\}\](\S+)\)/;
class Button extends Node_1.default {
    constructor() {
        super(...arguments);
        this.handleStyleChange = ({ node, getPos }) => event => {
            const title = node.attrs.title;
            const href = node.attrs.href;
            const style = event.target.value;
            if (style === node.attrs.style)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                href,
                title,
                style,
            });
            view.dispatch(transaction);
        };
        this.handleKeyDown = ({ node, getPos }) => event => {
            if (event.key === "Enter") {
                event.preventDefault();
                const { view } = this.editor;
                const pos = getPos() + node.nodeSize;
                view.focus();
                view.dispatch(prosemirror_utils_1.setTextSelection(pos)(view.state.tr));
                return;
            }
            if (event.key === "Backspace" && event.target.innerText === "") {
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos());
                const tr = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
                view.dispatch(tr.deleteSelection());
                view.focus();
                return;
            }
        };
        this.handleBlur = ({ node, getPos }) => event => {
            const title = event.target.innerText;
            const href = node.attrs.href;
            const style = node.attrs.style;
            if (title === node.attrs.title)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                href,
                title,
                style,
            });
            view.dispatch(transaction);
        };
        this.handleSelect = ({ getPos }) => event => {
            event.preventDefault();
            const { view } = this.editor;
            const $pos = view.state.doc.resolve(getPos());
            const transaction = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
            view.dispatch(transaction);
        };
        this.component = props => {
            const { theme, isEditable, isSelected } = props;
            const { href, title, style } = props.node.attrs;
            return (React.createElement(ButtonWrapper, { contentEditable: false, className: "btn-block", onClick: isEditable ? this.handleSelect(props) : undefined },
                React.createElement("div", { contentEditable: false },
                    React.createElement("select", { value: style, onChange: this.handleStyleChange(props) }, this.styleOptions.map(([key, label], index) => (React.createElement("option", { key: key, value: key }, label))))),
                React.createElement(ButtonTitle, { onKeyDown: this.handleKeyDown(props), onBlur: this.handleBlur(props), href: href, rel: "noreferrer nofollow", contentEditable: isEditable, suppressContentEditableWarning: true, className: "btn btn-" + style }, title)));
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
            content: "inline*",
            group: "block",
            inclusive: false,
            selectable: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "div[d-flex justify-content-center btn-block]",
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
                    "div",
                    { class: "d-flex justify-content-center btn-block" },
                    ["div", { contentEditable: false }, select],
                    [
                        "a",
                        {
                            href: node.attrs.href,
                            rel: "noopener noreferrer nofollow",
                            class: `btn btn-${node.attrs.style}`
                        },
                        0
                    ],
                ];
            },
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(BUTTON_INPUT_REGEX, (state, match, start, end) => {
                const [okay, title, style, href] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start, end, this.editor.schema.text(title)).setBlockType(start, start + title.length, state.schema.nodes.button, { href, title, style });
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
        state.write("[" + node.attrs.title + "](" + node.attrs.href + "){style=" + node.attrs.style + "}");
        state.write("\n\n");
    }
    parseMarkdown() {
        return {
            node: "button",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                style: tok.attrGet("style") || null,
                title: tok.attrGet("title") || null,
            }),
        };
    }
}
exports.default = Button;
const ButtonWrapper = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 1.5rem;
  padding-botton: 1.5rem;
`;
const ButtonTitle = styled_components_1.default.a `
  
`;
//# sourceMappingURL=Button.js.map