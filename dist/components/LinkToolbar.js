"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const React = __importStar(require("react"));
const LinkEditor_1 = __importDefault(require("./LinkEditor"));
const FloatingToolbar_1 = __importDefault(require("./FloatingToolbar"));
const createAndInsertLink_1 = __importDefault(require("../commands/createAndInsertLink"));
function isActive(props) {
    const { view } = props;
    const { selection } = view.state;
    const paragraph = view.domAtPos(selection.$from.pos);
    return (props.activeState > 0) && !!paragraph.node;
}
class LinkToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.menuRef = React.createRef();
        this.state = {
            left: -1000,
            top: undefined,
        };
        this.handleClickOutside = ev => {
            if (ev.target &&
                this.menuRef.current &&
                this.menuRef.current.contains(ev.target)) {
                return;
            }
            this.props.onClose();
        };
        this.handleOnCreateLink = async (title) => {
            const { dictionary, onCreateLink, view, onClose, onShowToast } = this.props;
            onClose();
            this.props.view.focus();
            if (!onCreateLink) {
                return;
            }
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert_1.default(from === to);
            const href = `creating#${title}…`;
            var is_button = false;
            if (this.props.activeState == 1) {
                dispatch(view.state.tr
                    .insertText(title, from, to)
                    .addMark(from, to + title.length, state.schema.marks.link.create({ href })));
            }
            else if (this.props.activeState == 3) {
                is_button = true;
                dispatch(view.state.tr
                    .insertText(title, from, to)
                    .setBlockType(from, to + title.length, state.schema.nodes.button, { href, title }));
            }
            createAndInsertLink_1.default(view, title, href, is_button, {
                onCreateLink,
                onShowToast,
                dictionary,
            });
        };
        this.handleOnSelectLink = ({ href, title, id, subtitle, image, event_obj }) => {
            const { view, onClose } = this.props;
            onClose();
            this.props.view.focus();
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            assert_1.default(from === to);
            if (this.props.activeState == 1 || (this.props.activeState == 2 && !subtitle && !image)) {
                dispatch(view.state.tr
                    .insertText(title, from, to)
                    .addMark(from, to + title.length, state.schema.marks.link.create({ href })));
            }
            else if (this.props.activeState == 2) {
                dispatch(view.state.tr
                    .insert(from, state.schema.nodes.link_with_preview.create({ href, title, id, subtitle, image, event_obj })));
            }
            else {
                dispatch(view.state.tr
                    .insert(from, state.schema.nodes.button.create({ href, title })));
            }
        };
    }
    componentDidMount() {
        window.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        window.removeEventListener("mousedown", this.handleClickOutside);
    }
    render() {
        const _a = this.props, { onCreateLink, onClose } = _a, rest = __rest(_a, ["onCreateLink", "onClose"]);
        const selection = this.props.view.state.selection;
        return (React.createElement(FloatingToolbar_1.default, Object.assign({ ref: this.menuRef, active: isActive(this.props) }, rest), isActive(this.props) && (React.createElement(LinkEditor_1.default, Object.assign({ from: selection.from, to: selection.to, onCreateLink: onCreateLink ? this.handleOnCreateLink : undefined, onSelectLink: this.handleOnSelectLink, onRemoveLink: onClose }, rest)))));
    }
}
exports.default = LinkToolbar;
//# sourceMappingURL=LinkToolbar.js.map