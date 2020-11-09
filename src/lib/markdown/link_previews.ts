import customFence from "markdown-it-container";

export default function link_previews(md): void {
  return customFence(md, "link_preview", {
    marker: ":",
    validate: () => true,
  });
}
