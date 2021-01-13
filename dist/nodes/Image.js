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
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_utils_1 = require("prosemirror-utils");
const styled_components_1 = __importDefault(require("styled-components"));
const react_medium_image_zoom_1 = __importDefault(require("react-medium-image-zoom"));
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const uploadPlaceholder_1 = __importDefault(require("../lib/uploadPlaceholder"));
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const Node_1 = __importDefault(require("./Node"));
const IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;
const uploadPlugin = options => new prosemirror_state_1.Plugin({
    props: {
        handleDOMEvents: {
            paste(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                if (!event.clipboardData)
                    return false;
                const files = Array.prototype.slice
                    .call(event.clipboardData.items)
                    .map(dt => dt.getAsFile())
                    .filter(file => file);
                if (files.length === 0)
                    return false;
                const { tr } = view.state;
                if (!tr.selection.empty) {
                    tr.deleteSelection();
                }
                const pos = tr.selection.from;
                insertFiles_1.default(view, event, pos, files, options);
                return true;
            },
            drop(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                const files = getDataTransferFiles_1.default(event).filter(file => /image/i.test(file.type));
                if (files.length === 0) {
                    return false;
                }
                const result = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                });
                if (result) {
                    insertFiles_1.default(view, event, result.pos, files, options);
                    return true;
                }
                return false;
            },
        },
    },
});
class Image extends Node_1.default {
    constructor() {
        super(...arguments);
        this.handleWidthChange = ({ node, getPos }, width) => {
            const src = node.attrs.src;
            const alt = node.attrs.alt;
            if (width === node.attrs.width)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                src,
                width,
                alt,
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
            const alt = event.target.innerText;
            const src = node.attrs.src;
            const width = node.attrs.width;
            if (alt === node.attrs.alt)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                src,
                alt,
                width
            });
            view.dispatch(transaction);
        };
        this.handleSelect = ({ getPos }) => event => {
            event.preventDefault();
        };
        this.component = props => {
            const { theme, isEditable, isSelected } = props;
            const { alt, width, src } = props.node.attrs;
            const ImageComponent = () => {
                const [test, setTest] = React.useState(null);
                const imgContainerRef = React.useRef(null);
                const imgWrapperRef = React.useRef(null);
                const initialWidth = width ? width : "75%";
                var imageDraggable = false;
                var isLeftDragging = true;
                var initialImageX = null;
                var initialPageX = null;
                const commitWidth = () => {
                    imageDraggable = false;
                    initialImageX = null;
                    initialPageX = null;
                    this.handleWidthChange(props, imgWrapperRef.current.style.width);
                };
                const handleCoverDrag = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const bounds = imgContainerRef.current.getBoundingClientRect();
                    if (e.pageX <= bounds.x + 10 ||
                        e.pageX >= (bounds.x + bounds.width - 10)) {
                        commitWidth();
                        return;
                    }
                    if (!imageDraggable)
                        return;
                    const effectiveX = isLeftDragging ? (initialImageX + (initialPageX - e.pageX)) : (initialImageX + (e.pageX - initialPageX));
                    let effectivePercent = (effectiveX / imgContainerRef.current.clientWidth) * 100;
                    if (effectivePercent < 0)
                        effectivePercent = 0;
                    else if (effectivePercent > 100 || effectivePercent > 90)
                        effectivePercent = 100;
                    imgWrapperRef.current.style.width = effectivePercent + "%";
                };
                const handleCoverDragStart = (e, isLeft) => {
                    imageDraggable = true;
                    isLeftDragging = isLeft;
                    if (!initialImageX) {
                        const percentPosition = parseInt(initialWidth, 10);
                        initialImageX = (percentPosition * imgContainerRef.current.clientWidth) / 100;
                    }
                    initialPageX = e.pageX;
                    e.stopPropagation();
                    e.preventDefault();
                };
                const handleCoverDragEnd = (e) => {
                    commitWidth();
                    e.stopPropagation();
                    e.preventDefault();
                };
                return (React.createElement("div", { contentEditable: false, className: "image", ref: imgContainerRef, onMouseMove: handleCoverDrag, onMouseUp: handleCoverDragEnd },
                    React.createElement(ImageWrapper, { className: "image-block " + (isSelected ? "ProseMirror-selectednode" : ""), onClick: isEditable ? this.handleSelect(props) : undefined, ref: imgWrapperRef, style: { width: initialWidth } },
                        React.createElement(react_medium_image_zoom_1.default, { image: {
                                src,
                                alt,
                                style: {
                                    display: "block",
                                    width: "100%",
                                    maxHeight: "100%",
                                },
                            }, defaultStyles: {
                                overlay: {
                                    backgroundColor: theme.background,
                                },
                            }, shouldRespectMaxDimension: true }),
                        isEditable && (React.createElement(React.Fragment, null,
                            React.createElement(ImageLeftBar, { className: "image-bar", onMouseDown: (e) => { handleCoverDragStart(e, true); } },
                                React.createElement(ImageLeftHandle, null)),
                            React.createElement(ImageRightBar, { className: "image-bar", onMouseDown: (e) => { handleCoverDragStart(e, false); } },
                                React.createElement(ImageRightHandle, null))))),
                    (isEditable || alt) && (React.createElement(Caption, { onKeyDown: this.handleKeyDown(props), onBlur: this.handleBlur(props), tabIndex: -1, contentEditable: isEditable, suppressContentEditableWarning: true }, alt))));
            };
            return (React.createElement(ImageComponent, null));
        };
    }
    get name() {
        return "image";
    }
    get schema() {
        return {
            inline: true,
            attrs: {
                src: {},
                width: {
                    default: "75%"
                },
                alt: {
                    default: null,
                },
            },
            content: "text*",
            marks: "",
            group: "inline",
            selectable: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "div[class=image]",
                    getAttrs: (dom) => {
                        const img = dom.getElementsByTagName("img")[0];
                        const caption = dom.getElementsByTagName("p")[0];
                        return {
                            src: img.getAttribute("src"),
                            alt: caption.innerText,
                        };
                    },
                },
            ],
            toDOM: node => {
                return [
                    "div",
                    {
                        class: "image",
                    },
                    [
                        "div",
                        { class: "image-block ", style: "width:" + node.attrs.width },
                        ["img", Object.assign(Object.assign({}, node.attrs), { contentEditable: false })],
                    ],
                    ["p", { class: "caption" }, 0],
                ];
            },
        };
    }
    toMarkdown(state, node) {
        state.write("![" +
            state.esc((node.attrs.alt || "").replace("\n", "") || "") +
            "](" +
            state.esc(node.attrs.src) +
            ")" +
            "{width=\"" + node.attrs.width + "\"}");
    }
    parseMarkdown() {
        return {
            node: "image",
            getAttrs: token => ({
                src: token.attrGet("src"),
                width: token.attrGet("width"),
                alt: (token.children[0] && token.children[0].content) || null,
            }),
        };
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            const { selection } = state;
            const position = selection.$cursor
                ? selection.$cursor.pos
                : selection.$to.pos;
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
            return true;
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
                const [okay, alt, src] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start - 1, end, type.create({
                        src,
                        alt,
                    }));
                }
                return tr;
            }),
        ];
    }
    get plugins() {
        return [uploadPlaceholder_1.default, uploadPlugin(this.options)];
    }
}
exports.default = Image;
const ImageWrapper = styled_components_1.default.span `
  position: relative;
  line-height: 0;
  display: inline-block;
`;
const ImageLeftBar = styled_components_1.default.div `
  position: absolute;
  display: flex;
  justify-content: center;
  width: 30px;
  height: 100%;
  top: 50%;
  left: 0px;
  transform: translate(0, -50%);
  cursor: col-resize;
`;
const ImageRightBar = styled_components_1.default.div `
  position: absolute;
  display: flex;
  justify-content: center;
  width: 30px;
  height: 100%;
  top: 50%;
  right: 0px;
  transform: translate(0, -50%);
  cursor: col-resize;
`;
const ImageLeftHandle = styled_components_1.default.div `
  align-self: center;
  width: 6px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #FFF;
  background: rgba(0,0,0,0.5);
`;
const ImageRightHandle = styled_components_1.default.div `
  align-self: center;
  width: 6px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #FFF;
  background: rgba(0,0,0,0.5);
`;
const Caption = styled_components_1.default.p `
  border: 0;
  display: block;
  font-size: 13px;
  font-style: italic;
  color: ${props => props.theme.textSecondary};
  padding: 2px 0;
  line-height: 16px;
  text-align: center;
  width: 100%;
  min-height: 1em;
  outline: none;
  background: none;
  resize: none;

  &:empty:before {
    color: ${props => props.theme.placeholder};
    content: "Write a caption";
    pointer-events: none;
  }
`;
//# sourceMappingURL=Image.js.map