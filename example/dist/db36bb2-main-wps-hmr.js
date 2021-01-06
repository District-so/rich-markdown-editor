webpackHotUpdate("main",{

/***/ "./src/components/LinkEditor.tsx":
/*!***************************************!*\
  !*** ./src/components/LinkEditor.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __importStar(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nconst prosemirror_utils_1 = __webpack_require__(/*! prosemirror-utils */ \"./node_modules/prosemirror-utils/dist/index.js\");\nconst outline_icons_1 = __webpack_require__(/*! outline-icons */ \"./node_modules/outline-icons/lib/index.js\");\nconst styled_components_1 = __importStar(__webpack_require__(/*! styled-components */ \"./node_modules/styled-components/dist/styled-components.browser.cjs.js\"));\nconst isUrl_1 = __importDefault(__webpack_require__(/*! ../lib/isUrl */ \"./src/lib/isUrl.ts\"));\nconst Flex_1 = __importDefault(__webpack_require__(/*! ./Flex */ \"./src/components/Flex.tsx\"));\nconst Input_1 = __importDefault(__webpack_require__(/*! ./Input */ \"./src/components/Input.tsx\"));\nconst ToolbarButton_1 = __importDefault(__webpack_require__(/*! ./ToolbarButton */ \"./src/components/ToolbarButton.tsx\"));\nconst LinkSearchResult_1 = __importDefault(__webpack_require__(/*! ./LinkSearchResult */ \"./src/components/LinkSearchResult.tsx\"));\nclass LinkEditor extends React.Component {\n    constructor() {\n        super(...arguments);\n        this.discardInputValue = false;\n        this.initialValue = this.href;\n        this.initialSelectionLength = this.props.to - this.props.from;\n        this.state = {\n            selectedIndex: -1,\n            value: this.href,\n            previousValue: \"\",\n            results: {},\n        };\n        this.componentWillUnmount = () => {\n            if (this.discardInputValue) {\n                return;\n            }\n            if (this.state.value === this.initialValue) {\n                return;\n            }\n            const href = (this.state.value || \"\").trim();\n            if (!href) {\n                return this.handleRemoveLink();\n            }\n            this.save(href, href);\n        };\n        this.save = (href, id, title, subtitle, image, event) => {\n            href = href.trim();\n            if (href.length === 0)\n                return;\n            this.discardInputValue = true;\n            const { from, to } = this.props;\n            if (!isUrl_1.default(href) && !href.startsWith(\"/\")) {\n                href = `https://${href}`;\n            }\n            this.props.onSelectLink({ href, id, title, subtitle, image, event });\n        };\n        this.handleKeyDown = (event) => {\n            switch (event.key) {\n                case \"Enter\": {\n                    event.preventDefault();\n                    const { selectedIndex, value } = this.state;\n                    const results = this.state.results[value] || [];\n                    const { onCreateLink } = this.props;\n                    if (selectedIndex >= 0) {\n                        const result = results[selectedIndex];\n                        if (result) {\n                            this.save(result.url, result.id, result.title, result.subtitle, result.image, result.event);\n                        }\n                        else if (onCreateLink && selectedIndex === results.length) {\n                            this.handleCreateLink(this.suggestedLinkTitle);\n                        }\n                    }\n                    else {\n                        this.save(value, value);\n                    }\n                    if (this.initialSelectionLength) {\n                        this.moveSelectionToEnd();\n                    }\n                    return;\n                }\n                case \"Escape\": {\n                    event.preventDefault();\n                    if (this.initialValue) {\n                        this.setState({ value: this.initialValue }, this.moveSelectionToEnd);\n                    }\n                    else {\n                        this.handleRemoveLink();\n                    }\n                    return;\n                }\n                case \"ArrowUp\": {\n                    if (event.shiftKey)\n                        return;\n                    event.preventDefault();\n                    event.stopPropagation();\n                    const prevIndex = this.state.selectedIndex - 1;\n                    this.setState({\n                        selectedIndex: Math.max(-1, prevIndex),\n                    });\n                    return;\n                }\n                case \"ArrowDown\":\n                    if (event.shiftKey)\n                        return;\n                case \"Tab\": {\n                    event.preventDefault();\n                    event.stopPropagation();\n                    const { selectedIndex, value } = this.state;\n                    const results = this.state.results[value] || [];\n                    const total = results.length;\n                    const nextIndex = selectedIndex + 1;\n                    this.setState({\n                        selectedIndex: Math.min(nextIndex, total),\n                    });\n                    return;\n                }\n            }\n        };\n        this.handleFocusLink = (selectedIndex) => {\n            this.setState({ selectedIndex });\n        };\n        this.handleChange = async (event) => {\n            const value = event.target.value;\n            this.setState({\n                value,\n                selectedIndex: -1,\n            });\n            const trimmedValue = value.trim();\n            if (trimmedValue && this.props.onSearchLink) {\n                try {\n                    const results = await this.props.onSearchLink(trimmedValue);\n                    this.setState(state => ({\n                        results: Object.assign(Object.assign({}, state.results), { [trimmedValue]: results }),\n                        previousValue: trimmedValue,\n                    }));\n                }\n                catch (error) {\n                    console.error(error);\n                }\n            }\n        };\n        this.handleOpenLink = (event) => {\n            event.preventDefault();\n            this.props.onClickLink(this.href, event);\n        };\n        this.handleCreateLink = (value) => {\n            this.discardInputValue = true;\n            const { onCreateLink } = this.props;\n            value = value.trim();\n            if (value.length === 0)\n                return;\n            if (onCreateLink)\n                return onCreateLink(value);\n        };\n        this.handleRemoveLink = () => {\n            this.discardInputValue = true;\n            const { from, to, mark, view, onRemoveLink } = this.props;\n            const { state, dispatch } = this.props.view;\n            if (mark) {\n                dispatch(state.tr.removeMark(from, to, mark));\n            }\n            if (onRemoveLink) {\n                onRemoveLink();\n            }\n            view.focus();\n        };\n        this.handleSelectLink = (url, id, title, subtitle, image, event) => event => {\n            event.preventDefault();\n            this.save(url, id, title, subtitle, image, event);\n            if (this.initialSelectionLength) {\n                this.moveSelectionToEnd();\n            }\n        };\n        this.moveSelectionToEnd = () => {\n            const { to, view } = this.props;\n            const { state, dispatch } = view;\n            dispatch(prosemirror_utils_1.setTextSelection(to)(state.tr));\n            view.focus();\n        };\n    }\n    get href() {\n        if (this.props.node)\n            return this.props.node.attrs.href;\n        return this.props.mark ? this.props.mark.attrs.href : \"\";\n    }\n    get suggestedLinkTitle() {\n        const { state } = this.props.view;\n        const { value } = this.state;\n        const selectionText = state.doc.cut(state.selection.from, state.selection.to).textContent;\n        return value.trim() || selectionText.trim();\n    }\n    render() {\n        const { dictionary, theme } = this.props;\n        const { value, selectedIndex } = this.state;\n        const results = this.state.results[value.trim()] ||\n            this.state.results[this.state.previousValue] ||\n            [];\n        const Tooltip = this.props.tooltip;\n        const looksLikeUrl = value.match(/^https?:\\/\\//i);\n        const suggestedLinkTitle = this.suggestedLinkTitle;\n        const showCreateLink = !!this.props.onCreateLink &&\n            !(suggestedLinkTitle === this.initialValue) &&\n            suggestedLinkTitle.length > 0 &&\n            !looksLikeUrl;\n        const showResults = !!suggestedLinkTitle && (showCreateLink || results.length > 0);\n        return (React.createElement(Wrapper, null,\n            React.createElement(Input_1.default, { value: value, placeholder: showCreateLink\n                    ? dictionary.findOrCreateDoc\n                    : dictionary.searchOrPasteLink, onKeyDown: this.handleKeyDown, onChange: this.handleChange, autoFocus: this.href === \"\" }),\n            React.createElement(ToolbarButton_1.default, { onClick: this.handleOpenLink, disabled: !value },\n                React.createElement(Tooltip, { tooltip: dictionary.openLink, placement: \"top\" },\n                    React.createElement(outline_icons_1.OpenIcon, { color: theme.toolbarItem }))),\n            React.createElement(ToolbarButton_1.default, { onClick: this.handleRemoveLink },\n                React.createElement(Tooltip, { tooltip: dictionary.removeLink, placement: \"top\" }, this.initialValue ? (React.createElement(React.Fragment, null, (!this.props.node || this.props.node.type != this.props.view.state.schema.nodes.button) && (React.createElement(outline_icons_1.TrashIcon, { color: theme.toolbarItem })))) : (React.createElement(outline_icons_1.CloseIcon, { color: theme.toolbarItem })))),\n            showResults && (React.createElement(SearchResults, { id: \"link-search-results\" },\n                results.map((result, index) => (React.createElement(LinkSearchResult_1.default, { key: result.url, title: result.title, subtitle: result.subtitle, icon: React.createElement(outline_icons_1.DocumentIcon, { color: theme.toolbarItem }), onMouseOver: () => this.handleFocusLink(index), onClick: this.handleSelectLink(result.url, result.id, result.title, result.subtitle, result.image, result.event), selected: index === selectedIndex }))),\n                showCreateLink && (React.createElement(LinkSearchResult_1.default, { key: \"create\", title: suggestedLinkTitle, subtitle: dictionary.createNewDoc, icon: React.createElement(outline_icons_1.PlusIcon, { color: theme.toolbarItem }), onMouseOver: () => this.handleFocusLink(results.length), onClick: () => {\n                        this.handleCreateLink(suggestedLinkTitle);\n                        if (this.initialSelectionLength) {\n                            this.moveSelectionToEnd();\n                        }\n                    }, selected: results.length === selectedIndex }))))));\n    }\n}\nconst Wrapper = styled_components_1.default(Flex_1.default) `\n  margin-left: -8px;\n  margin-right: -8px;\n  min-width: 336px;\n`;\nconst SearchResults = styled_components_1.default.ol `\n  background: ${props => props.theme.toolbarBackground};\n  position: absolute;\n  top: 100%;\n  width: 100%;\n  height: auto;\n  left: 0;\n  padding: 4px 8px 8px;\n  margin: 0;\n  margin-top: -3px;\n  margin-bottom: 0;\n  border-radius: 0 0 4px 4px;\n  overflow-y: auto;\n  max-height: 25vh;\n`;\nexports.default = styled_components_1.withTheme(LinkEditor);\n\n\n//# sourceURL=webpack:///./src/components/LinkEditor.tsx?");

/***/ })

})