import * as React from "react";
import { toggleMark } from "prosemirror-commands";
import { Plugin, NodeSelection } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
import { findParentNode } from "prosemirror-utils";
import getNodeRange from "../queries/getNodeRange";
import { setTextSelection } from "prosemirror-utils";
import styled from "styled-components";

const BUTTON_INPUT_REGEX = /\[\{(.+)\}\{(.+)\}\](\S+)\)/;

export default class Button extends Node {
  get styleOptions() {
    return Object.entries({
      primary: this.options.dictionary.primary,
      secondary: this.options.dictionary.secondary,
      success: this.options.dictionary.success,
      warning: this.options.dictionary.warning,
      danger: this.options.dictionary.danger,
      info: this.options.dictionary.info,
      white: this.options.dictionary.white,
      light: this.options.dictionary.light,
      dark: this.options.dictionary.dark,
    });
  }

  get name() {
    return "button";
  }

  get schema() {
    return {
      attrs: {
        href: {
          default: "",
        },
        title: {
          default: "",
        },
        style: {
          default: "primary",
        },
      },
      content: "inline*",
      group: "block",
      inclusive: false,
      selectable: true,
      draggable: true,
      parseDOM: [
        {
          tag: "div[d-flex justify-content-center btn-block]",
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
            style: dom.getAttribute("subtitle"),
          }),
        },
      ],
      toDOM: node => {
        const select = document.createElement("select");
        // @ts-ignore
        select.addEventListener("change", this.handleStyleChange);

        this.styleOptions.forEach(([key, label]) => {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.style === key;
          select.appendChild(option);
        });

        return [
          "div",
          { class: "d-flex justify-content-center btn-block" },
          ["div", { contentEditable: false }, select],
          [
            "a",
            {
              href: node.attrs.href,
              rel: "noopener noreferrer nofollow",
              class: `btn btn-md btn-${node.attrs.style}`
            },
            0
          ],
        ]
      },
    };
  }

  handleStyleChange = ({ node, getPos }) => event => {
    const title = node.attrs.title;
    const href = node.attrs.href;
    const style = event.target.value;
    if (style === node.attrs.style) return;

    const { view } = this.editor;
    const { tr } = view.state;

    // update meta on object
    const pos = getPos();
    const transaction = tr.setNodeMarkup(pos, undefined, {
      href,
      title,
      style,
    });
    view.dispatch(transaction);
  };

  handleKeyDown = ({ node, getPos }) => event => {
    // Pressing Enter in the caption field should move the cursor/selection
    // below the button
    if (event.key === "Enter") {
      event.preventDefault();

      const { view } = this.editor;
      const pos = getPos() + node.nodeSize;
      view.focus();
      view.dispatch(setTextSelection(pos)(view.state.tr));
      return;
    }

    // Pressing Backspace in an an empty caption field should remove the entire
    // button, leaving an empty paragraph
    if (event.key === "Backspace" && event.target.innerText === "") {
      const { view } = this.editor;
      const $pos = view.state.doc.resolve(getPos());
      const tr = view.state.tr.setSelection(new NodeSelection($pos));
      view.dispatch(tr.deleteSelection());
      view.focus();
      return;
    }
  };

  handleBlur = ({ node, getPos }) => event => {
    const title = event.target.innerText;
    const href = node.attrs.href;
    const style = node.attrs.style;
    if (title === node.attrs.title) return;

    const { view } = this.editor;
    const { tr } = view.state;

    // update meta on object
    const pos = getPos();
    const transaction = tr.setNodeMarkup(pos, undefined, {
      href,
      title,
      style,
    });
    view.dispatch(transaction);
  };

  handleSelect = ({ getPos }) => event => {
    event.preventDefault();

    const { view } = this.editor;
    const $pos = view.state.doc.resolve(getPos());
    const transaction = view.state.tr.setSelection(new NodeSelection($pos));
    view.dispatch(transaction);
  };

  component = props => {
    const { theme, isEditable, isSelected } = props;
    const { href, title, style } = props.node.attrs;

    return (
      <ButtonWrapper 
        contentEditable={false} 
        className="btn-block"
        onClick={isEditable ? this.handleSelect(props) : undefined}
      >
        <div contentEditable={false}>
          <select value={style} onChange={this.handleStyleChange(props)}>
            {this.styleOptions.map(([key, label], index) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <ButtonTitle
          onKeyDown={this.handleKeyDown(props)}
          onBlur={this.handleBlur(props)}
          href={href} 
          rel="noreferrer nofollow"
          contentEditable={isEditable}
          suppressContentEditableWarning
          className={"btn btn-md btn-"+style}
        >
          {title}
        </ButtonTitle>
      </ButtonWrapper>
    );
  }

  inputRules({ type }) {
    return [
      new InputRule(BUTTON_INPUT_REGEX, (state, match, start, end) => {
        const [okay, title, style, href] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, this.editor.schema.text(title)).setBlockType(
            start,
            start + title.length,
            state.schema.nodes.button,
            { href, title, style }
          );
        }

        return tr;
      }),
    ];
  }

  commands({ type }) {
    return ({ href } = { href: "" }) => toggleMark(type, { href });
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            mouseover: (view, event: MouseEvent) => {
              if (
                event.target instanceof HTMLAnchorElement &&
                !event.target.className.includes("ProseMirror-widget")
              ) {
                if (this.options.onHoverLink) {
                  return this.options.onHoverLink(event);
                }
              }
              return false;
            },
            click: (view, event: MouseEvent) => {
              // allow opening links in editing mode with the meta/cmd key
              if (
                view.props.editable &&
                view.props.editable(view.state) &&
                !event.metaKey
              ) {
                return false;
              }

              if (event.target instanceof HTMLAnchorElement) {
                const href =
                  event.target.href ||
                  (event.target.parentNode instanceof HTMLAnchorElement
                    ? event.target.parentNode.href
                    : "");

                const isHashtag = href.startsWith("#");
                if (isHashtag && this.options.onClickHashtag) {
                  event.stopPropagation();
                  event.preventDefault();
                  this.options.onClickHashtag(href, event);
                  return true;
                }

                if (this.options.onClickLink) {
                  event.stopPropagation();
                  event.preventDefault();
                  this.options.onClickLink(href, event);
                  return true;
                }
              }

              return false;
            },
          },
        },
      }),
    ];
  }

  toMarkdown(state, node) {
    state.ensureNewLine();
    state.write("[" + node.attrs.title + "]("+ node.attrs.href +"){style="+ node.attrs.style +"}");
    state.write("\n\n");
  }

  parseMarkdown() {
    return {
      node: "button",
      getAttrs: tok => ({
        href: tok.attrGet("href"),
        style: tok.attrGet("style") || null,
        title: tok.attrGet("title") || null,
      }),
    };
  }
}


const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 1.5rem;
  padding-botton: 1.5rem;
`;

const ButtonTitle = styled.a`
  
`;


