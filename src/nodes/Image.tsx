import * as React from "react";
import { Plugin, NodeSelection } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import { setTextSelection } from "prosemirror-utils";
import styled from "styled-components";
import ImageZoom from "react-medium-image-zoom";
import getDataTransferFiles from "../lib/getDataTransferFiles";
import uploadPlaceholderPlugin from "../lib/uploadPlaceholder";
import insertFiles from "../commands/insertFiles";
import Node from "./Node";

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

const CENTER_STYLE = {
  display: "inline-block",
  maxWidth: "100%",
  maxHeight: "75vh",
};

const FULL_WIDTH_STYLE = {
  display: "block",
  width: "100%",
  maxHeight: "100%",
};

const THUMBNAIL_STYLE = {
  display: "inline-block",
  maxWidth: "100%",
  maxHeight: "250px",
};

const uploadPlugin = options =>
  new Plugin({
    props: {
      handleDOMEvents: {
        paste(view, event: ClipboardEvent): boolean {
          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          if (!event.clipboardData) return false;

          // check if we actually pasted any files
          const files = Array.prototype.slice
            .call(event.clipboardData.items)
            .map(dt => dt.getAsFile())
            .filter(file => file);

          if (files.length === 0) return false;

          const { tr } = view.state;
          if (!tr.selection.empty) {
            tr.deleteSelection();
          }
          const pos = tr.selection.from;

          insertFiles(view, event, pos, files, options);
          return true;
        },
        drop(view, event: DragEvent): boolean {
          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          // filter to only include image files
          const files = getDataTransferFiles(event).filter(file =>
            /image/i.test(file.type)
          );
          if (files.length === 0) {
            return false;
          }

          // grab the position in the document for the cursor
          const result = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (result) {
            insertFiles(view, event, result.pos, files, options);
            return true;
          }

          return false;
        },
      },
    },
  });

export default class Image extends Node {
  get alignmentOptions() {
    return Object.entries({
      center: this.options.dictionary.center,
      full_width: this.options.dictionary.fullWidth,
      thumbnail: this.options.dictionary.thumbnail,
    });
  }

  get alignmentStyles() {
    return {
      center: CENTER_STYLE,
      full_width: FULL_WIDTH_STYLE,
      thumbnail: THUMBNAIL_STYLE,
    };
  }

  get name() {
    return "image";
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alignment: {
          default: "center"
        },
        alt: {
          default: null,
        },
      },
      content: "text*",
      marks: "",
      group: "inline",
      selectable: true,
      draggable: true,
      parseDOM: [
        {
          tag: "div[class=image]",
          getAttrs: (dom: HTMLElement) => {
            const img = dom.getElementsByTagName("img")[0];
            const caption = dom.getElementsByTagName("p")[0];

            return {
              src: img.getAttribute("src"),
              alt: caption.innerText,
            };
          },
        },
      ],
      toDOM: node => {
        const select = document.createElement("select");
        // @ts-ignore
        select.addEventListener("change", this.handleAlignmentChange);

        this.alignmentOptions.forEach(([key, label]) => {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.alignment === key;
          select.appendChild(option);
        });

        return [
          "div",
          {
            class: "image",
          },
          [
            "div", 
            { class: "image-block " + node.attrs.alignment }, 
            ["div", { contentEditable: false }, select],
            ["img", { ...node.attrs, contentEditable: false }],
          ],
          ["p", { class: "caption" }, 0],
        ];
      },
    };
  }

  handleAlignmentChange = ({ node, getPos }) => event => {
    const src = node.attrs.src;
    const alt = node.attrs.alt;
    const alignment = event.target.value;
    if (alignment === node.attrs.alignment) return;

    const { view } = this.editor;
    const { tr } = view.state;

    // update meta on object
    const pos = getPos();
    const transaction = tr.setNodeMarkup(pos, undefined, {
      src,
      alignment,
      alt,
    });
    view.dispatch(transaction);
  };

  handleKeyDown = ({ node, getPos }) => event => {
    // Pressing Enter in the caption field should move the cursor/selection
    // below the image
    if (event.key === "Enter") {
      event.preventDefault();

      const { view } = this.editor;
      const pos = getPos() + node.nodeSize;
      view.focus();
      view.dispatch(setTextSelection(pos)(view.state.tr));
      return;
    }

    // Pressing Backspace in an an empty caption field should remove the entire
    // image, leaving an empty paragraph
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
    const alt = event.target.innerText;
    const src = node.attrs.src;
    if (alt === node.attrs.alt) return;

    const { view } = this.editor;
    const { tr } = view.state;

    // update meta on object
    const pos = getPos();
    const transaction = tr.setNodeMarkup(pos, undefined, {
      src,
      alt,
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
    const { alt, alignment, src } = props.node.attrs;

    return (
      <div contentEditable={false} className="image">
        <ImageWrapper
          className={alignment + " image-block " + (isSelected ? "ProseMirror-selectednode" : "")}
          onClick={isEditable ? this.handleSelect(props) : undefined}
        >
          <div contentEditable={false}>
            <select onChange={this.handleAlignmentChange(props)}>
              {this.alignmentOptions.map(([key, label], index) => (
                <option key={key} value={key} selected={(key == alignment)}>{label}</option>
              ))}
            </select>
          </div>
          <ImageZoom
            image={{
              src,
              alt,
              style: this.alignmentStyles[alignment],
            }}
            defaultStyles={{
              overlay: {
                backgroundColor: theme.background,
              },
            }}
            shouldRespectMaxDimension
          />
        </ImageWrapper>

        {(isEditable || alt) && (
          <Caption
            onKeyDown={this.handleKeyDown(props)}
            onBlur={this.handleBlur(props)}
            tabIndex={-1}
            contentEditable={isEditable}
            suppressContentEditableWarning
          >
            {alt}
          </Caption>
        )}
      </div>
    );
  };

  toMarkdown(state, node) {
    state.write(
      "![" +
        state.esc((node.attrs.alt || "").replace("\n", "") || "") +
        "](" +
        state.esc(node.attrs.src) +
        ")" +
        "{alignment=" + node.attrs.alignment + "}"
    );
  }

  parseMarkdown() {
    return {
      node: "image",
      getAttrs: token => ({
        src: token.attrGet("src"),
        alignment: token.attrGet("alignment"),
        alt: (token.children[0] && token.children[0].content) || null,
      }),
    };
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
      return true;
    };
  }

  inputRules({ type }) {
    return [
      new InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, src] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(
            start - 1,
            end,
            type.create({
              src,
              alt,
            })
          );
        }

        return tr;
      }),
    ];
  }

  get plugins() {
    return [uploadPlaceholderPlugin, uploadPlugin(this.options)];
  }
}

const ImageWrapper = styled.span`
  
`;

const Caption = styled.p`
  border: 0;
  display: block;
  font-size: 13px;
  font-style: italic;
  color: ${props => props.theme.textSecondary};
  padding: 2px 0;
  line-height: 16px;
  text-align: center;
  width: 100%;
  min-height: 1em;
  outline: none;
  background: none;
  resize: none;

  &:empty:before {
    color: ${props => props.theme.placeholder};
    content: "Write a caption";
    pointer-events: none;
  }
`;
