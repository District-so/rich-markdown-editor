"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
function link_previews(md) {
    return markdown_it_container_1.default(md, "link_preview", {
        marker: ":",
        validate: () => true,
    });
}
exports.default = link_previews;
//# sourceMappingURL=link_previews.js.map