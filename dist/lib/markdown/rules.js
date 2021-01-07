"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
const mark_1 = __importDefault(require("./mark"));
const checkboxes_1 = __importDefault(require("./checkboxes"));
const embeds_1 = __importDefault(require("./embeds"));
const breaks_1 = __importDefault(require("./breaks"));
const tables_1 = __importDefault(require("./tables"));
const notices_1 = __importDefault(require("./notices"));
const link_previews_1 = __importDefault(require("./link_previews"));
const buttons_1 = __importDefault(require("./buttons"));
const underlines_1 = __importDefault(require("./underlines"));
function rules({ embeds }) {
    var md = markdown_it_1.default("default", {
        breaks: false,
        html: false,
    })
        .use(markdown_it_attrs_1.default, {
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: []
    })
        .use(embeds_1.default(embeds))
        .use(link_previews_1.default)
        .use(buttons_1.default)
        .use(breaks_1.default)
        .use(checkboxes_1.default)
        .use(mark_1.default({ delim: "==", mark: "mark" }))
        .use(mark_1.default({ delim: "!!", mark: "placeholder" }))
        .use(underlines_1.default)
        .use(tables_1.default)
        .use(notices_1.default);
    return md;
}
exports.default = rules;
//# sourceMappingURL=rules.js.map