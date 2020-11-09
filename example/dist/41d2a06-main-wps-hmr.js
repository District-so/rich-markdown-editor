webpackHotUpdate("main",{

/***/ "./src/lib/markdown/link_previews.ts":
/*!*******************************************!*\
  !*** ./src/lib/markdown/link_previews.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst markdown_it_container_1 = __importDefault(__webpack_require__(/*! markdown-it-container */ \"./node_modules/markdown-it-container/index.js\"));\nfunction link_previews(md) {\n    return markdown_it_container_1.default(md, \"link_preview\", {\n        marker: \":\",\n        validate: () => true,\n    });\n}\nexports.default = link_previews;\n\n\n//# sourceURL=webpack:///./src/lib/markdown/link_previews.ts?");

/***/ }),

/***/ "./src/lib/markdown/rules.ts":
/*!***********************************!*\
  !*** ./src/lib/markdown/rules.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst markdown_it_1 = __importDefault(__webpack_require__(/*! markdown-it */ \"./node_modules/markdown-it/index.js\"));\nconst mark_1 = __importDefault(__webpack_require__(/*! ./mark */ \"./src/lib/markdown/mark.ts\"));\nconst checkboxes_1 = __importDefault(__webpack_require__(/*! ./checkboxes */ \"./src/lib/markdown/checkboxes.ts\"));\nconst embeds_1 = __importDefault(__webpack_require__(/*! ./embeds */ \"./src/lib/markdown/embeds.ts\"));\nconst breaks_1 = __importDefault(__webpack_require__(/*! ./breaks */ \"./src/lib/markdown/breaks.ts\"));\nconst tables_1 = __importDefault(__webpack_require__(/*! ./tables */ \"./src/lib/markdown/tables.ts\"));\nconst notices_1 = __importDefault(__webpack_require__(/*! ./notices */ \"./src/lib/markdown/notices.ts\"));\nconst link_previews_1 = __importDefault(__webpack_require__(/*! ./link_previews */ \"./src/lib/markdown/link_previews.ts\"));\nconst underlines_1 = __importDefault(__webpack_require__(/*! ./underlines */ \"./src/lib/markdown/underlines.ts\"));\nfunction rules({ embeds }) {\n    return markdown_it_1.default(\"default\", {\n        breaks: false,\n        html: false,\n    })\n        .use(embeds_1.default(embeds))\n        .use(breaks_1.default)\n        .use(checkboxes_1.default)\n        .use(mark_1.default({ delim: \"==\", mark: \"mark\" }))\n        .use(mark_1.default({ delim: \"!!\", mark: \"placeholder\" }))\n        .use(underlines_1.default)\n        .use(tables_1.default)\n        .use(notices_1.default)\n        .use(link_previews_1.default);\n}\nexports.default = rules;\n\n\n//# sourceURL=webpack:///./src/lib/markdown/rules.ts?");

/***/ })

})