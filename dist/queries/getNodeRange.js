"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_utils_1 = require("prosemirror-utils");
const getNodeRange = (type) => state => {
    const node = prosemirror_utils_1.findSelectedNodeOfType(type)(state.selection) ||
        prosemirror_utils_1.findParentNode(node => node.type === type)(state.selection);
    if (!node || node === 'undefined') {
        return !!node;
    }
    const startPos = node.pos;
    const endPos = startPos + node.node.nodeSize;
    return { from: startPos, to: endPos, node: node.node };
};
exports.default = getNodeRange;
//# sourceMappingURL=getNodeRange.js.map