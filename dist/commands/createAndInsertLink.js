"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
function findPlaceholderLink(doc, href) {
    let result;
    function findLinks(node, pos = 0) {
        if (node.type.name === "text") {
            node.marks.forEach(mark => {
                if (mark.type.name === "link") {
                    if (mark.attrs.href === href) {
                        result = { node, pos };
                        if (result)
                            return false;
                    }
                }
            });
        }
        if (!node.content.size) {
            return;
        }
        node.descendants(findLinks);
    }
    findLinks(doc);
    return result;
}
function findPlaceholderButton(state, href) {
    let result;
    function findButtonNodes(node, pos = 0) {
        if (node.type == state.schema.nodes.button) {
            if (node.attrs.href === href) {
                result = { node, pos };
            }
        }
        if (!node.content.size) {
            return;
        }
        node.descendants(findButtonNodes);
    }
    findButtonNodes(state.doc);
    return result;
}
const createAndInsertLink = async function (view, title, href, is_button, options) {
    const { dispatch, state } = view;
    const { onCreateLink, onShowToast } = options;
    try {
        const url = await onCreateLink(title);
        if (is_button) {
            const result = findPlaceholderButton(state, href);
            if (!result)
                return;
            dispatch(view.state.tr
                .setBlockType(result.pos, result.pos + result.node.attrs.title, state.schema.nodes.button, {
                href: url,
                title: result.node.attrs.title,
                style: result.node.attrs.style
            }));
        }
        else {
            const result = findPlaceholderLink(view.state.doc, href);
            if (!result)
                return;
            dispatch(view.state.tr
                .removeMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link)
                .addMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link.create({ href: url })));
        }
    }
    catch (err) {
        const result = findPlaceholderLink(view.state.doc, href);
        if (!result)
            return;
        dispatch(view.state.tr.removeMark(result.pos, result.pos + result.node.nodeSize, state.schema.marks.link));
        if (onShowToast) {
            onShowToast(options.dictionary.createLinkError, types_1.ToastType.Error);
        }
    }
};
exports.default = createAndInsertLink;
//# sourceMappingURL=createAndInsertLink.js.map