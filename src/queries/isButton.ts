export default function isButton(node, schema) {
  return (
    node.type === schema.nodes.button
  );
}