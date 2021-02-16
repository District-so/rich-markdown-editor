webpackHotUpdate("main",{

/***/ "./src/nodes/LinkPreview.tsx":
/*!***********************************!*\
  !*** ./src/nodes/LinkPreview.tsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst prosemirror_commands_1 = __webpack_require__(/*! prosemirror-commands */ \"./node_modules/prosemirror-commands/dist/index.js\");\nconst prosemirror_state_1 = __webpack_require__(/*! prosemirror-state */ \"./node_modules/prosemirror-state/dist/index.js\");\nconst prosemirror_inputrules_1 = __webpack_require__(/*! prosemirror-inputrules */ \"./node_modules/prosemirror-inputrules/dist/index.js\");\nconst Node_1 = __importDefault(__webpack_require__(/*! ./Node */ \"./src/nodes/Node.ts\"));\nconst LINK_PREVIEW_INPUT_REGEX = /\\[\\{\\[(.+)\\],\\s?\\[(.*)\\],\\s?\\[(.*)\\]\\}\\]\\((\\S+)\\)/;\nclass LinkPreview extends Node_1.default {\n    get name() {\n        return \"link_with_preview\";\n    }\n    get schema() {\n        return {\n            attrs: {\n                href: {\n                    default: \"\",\n                },\n                title: {\n                    default: \"\",\n                },\n                id: {\n                    default: \"\",\n                },\n                subtitle: {\n                    default: \"\",\n                },\n                image: {\n                    default: \"\",\n                },\n                event_obj: {\n                    default: null,\n                }\n            },\n            content: \"inline*\",\n            group: \"block\",\n            inclusive: false,\n            draggable: true,\n            parseDOM: [\n                {\n                    tag: \"a.post-card\",\n                    priority: 55,\n                    getAttrs: (dom) => {\n                        console.log('getAttrs', dom);\n                        const img = dom.getElementsByTagName(\"img\")[0];\n                        const title = dom.getElementsByClassName(\"title\")[0];\n                        const subtitle = dom.getElementsByClassName(\"subtitle\")[0];\n                        return {\n                            href: dom.getAttribute(\"href\"),\n                            id: dom.getAttribute(\"data-id\"),\n                            title: title.innerText,\n                            subtitle: subtitle.innerText,\n                            image: img.getAttribute(\"src\"),\n                            event_obj: dom.getAttribute(\"event_obj\"),\n                        };\n                    },\n                },\n            ],\n            toDOM: node => {\n                console.log('node', node);\n                const title = document.createElement(\"div\");\n                title.innerHTML = node.attrs.title;\n                title.className = \"title\";\n                const subtitle = document.createElement(\"p\");\n                subtitle.innerHTML = node.attrs.subtitle;\n                subtitle.className = 'subtitle';\n                var result = [\n                    \"a\",\n                    {\n                        'data-id': node.attrs.id,\n                        href: node.attrs.href,\n                        rel: \"noopener noreferrer nofollow\",\n                        class: \"post-card card\"\n                    },\n                ];\n                if (node.attrs.image) {\n                    const image = document.createElement(\"img\");\n                    image.src = node.attrs.image;\n                    image.className = 'post-image';\n                    result.push(image);\n                }\n                if (node.attrs.event_obj && node.attrs.event_obj.day && node.attrs.event_obj.month) {\n                    const day = document.createElement(\"label\");\n                    day.innerHTML = node.attrs.event_obj.day;\n                    day.className = \"event-day text-primary\";\n                    const month = document.createElement(\"label\");\n                    month.innerHTML = node.attrs.event_obj.month;\n                    month.className = \"event-month text-uppercase mb-1 text-sm\";\n                    result.push([\"div\",\n                        { class: \"post-text-content\" },\n                        [\n                            \"div\",\n                            { class: \"d-flex post-event-title\" },\n                            [\n                                \"div\",\n                                { class: \"event-block alert bg-light text-center px-2 pt-1 pb-0 mr-3 mb-0\" },\n                                month,\n                                day,\n                            ],\n                            title,\n                        ],\n                        subtitle\n                    ]);\n                }\n                else {\n                    result.push([\"div\", { class: \"post-text-content\" }, title, subtitle]);\n                }\n                return result;\n            },\n        };\n    }\n    inputRules({ type }) {\n        return [\n            new prosemirror_inputrules_1.InputRule(LINK_PREVIEW_INPUT_REGEX, (state, match, start, end) => {\n                const [okay, title, subtitle, image, href] = match;\n                const { tr } = state;\n                if (okay) {\n                    tr.replaceWith(start, end, this.editor.schema.text(title)).addMark(start, start + title.length, type.create({ href }));\n                }\n                return tr;\n            }),\n        ];\n    }\n    commands({ type }) {\n        return ({ href } = { href: \"\" }) => prosemirror_commands_1.toggleMark(type, { href });\n    }\n    get plugins() {\n        return [\n            new prosemirror_state_1.Plugin({\n                props: {\n                    handleDOMEvents: {\n                        mouseover: (view, event) => {\n                            if (event.target instanceof HTMLAnchorElement &&\n                                !event.target.className.includes(\"ProseMirror-widget\")) {\n                                if (this.options.onHoverLink) {\n                                    return this.options.onHoverLink(event);\n                                }\n                            }\n                            return false;\n                        },\n                        click: (view, event) => {\n                            if (view.props.editable &&\n                                view.props.editable(view.state) &&\n                                !event.metaKey) {\n                                return false;\n                            }\n                            if (event.target instanceof HTMLAnchorElement) {\n                                const href = event.target.href ||\n                                    (event.target.parentNode instanceof HTMLAnchorElement\n                                        ? event.target.parentNode.href\n                                        : \"\");\n                                const isHashtag = href.startsWith(\"#\");\n                                if (isHashtag && this.options.onClickHashtag) {\n                                    event.stopPropagation();\n                                    event.preventDefault();\n                                    this.options.onClickHashtag(href, event);\n                                    return true;\n                                }\n                                if (this.options.onClickLink) {\n                                    event.stopPropagation();\n                                    event.preventDefault();\n                                    this.options.onClickLink(href, event);\n                                    return true;\n                                }\n                            }\n                            return false;\n                        },\n                    },\n                },\n            }),\n        ];\n    }\n    toMarkdown(state, node) {\n        state.ensureNewLine();\n        if (node.attrs.event_obj && node.attrs.event_obj.day && node.attrs.event_obj.month) {\n            state.write(\"[\" + node.attrs.title + \"](\" + node.attrs.href + \"){id=\" + node.attrs.id + \" subtitle=\\\"\" + node.attrs.subtitle + \"\\\" image=\\\"\" + node.attrs.image + \"\\\" event_day=\" + node.attrs.event_obj.day + \" event_month=\" + node.attrs.event_obj.month + \"}\");\n        }\n        else\n            state.write(\"[\" + node.attrs.title + \"](\" + node.attrs.href + \"){id=\" + node.attrs.id + \" subtitle=\\\"\" + node.attrs.subtitle + \"\\\" image=\\\"\" + node.attrs.image + \"\\\"}\");\n        state.write(\"\\n\\n\");\n    }\n    parseMarkdown() {\n        return {\n            node: \"link_with_preview\",\n            getAttrs: tok => ({\n                href: tok.attrGet(\"href\"),\n                title: tok.attrGet(\"title\") || null,\n                id: tok.attrGet(\"id\") || null,\n                subtitle: tok.attrGet(\"subtitle\") || null,\n                image: tok.attrGet(\"image\") || null,\n                event_obj: tok.attrGet(\"event_obj\") || null,\n            }),\n        };\n    }\n}\nexports.default = LinkPreview;\n\n\n//# sourceURL=webpack:///./src/nodes/LinkPreview.tsx?");

/***/ })

})