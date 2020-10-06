webpackHotUpdate("main",{

/***/ "./src/components/Menu.tsx":
/*!*********************************!*\
  !*** ./src/components/Menu.tsx ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __importStar(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nconst styled_components_1 = __webpack_require__(/*! styled-components */ \"./node_modules/styled-components/dist/styled-components.browser.cjs.js\");\nconst ToolbarButton_1 = __importDefault(__webpack_require__(/*! ./ToolbarButton */ \"./src/components/ToolbarButton.tsx\"));\nconst ToolbarSeparator_1 = __importDefault(__webpack_require__(/*! ./ToolbarSeparator */ \"./src/components/ToolbarSeparator.tsx\"));\nclass Menu extends React.Component {\n    render() {\n        const { view, items } = this.props;\n        const { state } = view;\n        const Tooltip = this.props.tooltip;\n        return (React.createElement(\"div\", { style: { display: 'flex' } }, items.map((item, index) => {\n            if (item.name === \"separator\" && item.visible !== false) {\n                return React.createElement(ToolbarSeparator_1.default, { key: index });\n            }\n            if (item.visible === false || !item.icon) {\n                return null;\n            }\n            const Icon = item.icon;\n            const isActive = item.active ? item.active(state) : false;\n            return (React.createElement(ToolbarButton_1.default, { key: index, onClick: () => item.name && this.props.commands[item.name](item.attrs), active: isActive },\n                React.createElement(Tooltip, { tooltip: item.tooltip, placement: \"top\" },\n                    React.createElement(Icon, { color: this.props.theme.toolbarItem }))));\n        })));\n    }\n}\nexports.default = styled_components_1.withTheme(Menu);\n\n\n//# sourceURL=webpack:///./src/components/Menu.tsx?");

/***/ })

})