import { ResolvedPos, MarkType } from "prosemirror-model";
import { findParentNode, findSelectedNodeOfType } from "prosemirror-utils";

const getNodeRange = (type) => state => {
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode(node => node.type === type)(state.selection);

  if (!node || node === 'undefined') {
    return !!node;
  }

  const startPos = node.pos;
  const endPos = startPos + node.node.nodeSize;

  return { from: startPos, to: endPos, node: node.node };
};

export default getNodeRange;