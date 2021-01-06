import { toggleMark } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";

const LINK_PREVIEW_INPUT_REGEX = /\[\{\[(.+)\],\s?\[(.*)\],\s?\[(.*)\]\}\]\((\S+)\)/;

export default class LinkPreview extends Node {
  get name() {
    return "link_with_preview";
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
        subtitle: {
          default: "",
        },
        image: {
          default: "",
        },
      },
      content: "inline*",
      group: "block",
      inclusive: false,
      draggable: true,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
            subtitle: dom.getAttribute("subtitle"),
            image: dom.getAttribute("image"),
          }),
        },
      ],
      toDOM: node => {
        const title = document.createElement("div");
        title.innerHTML = node.attrs.title;
        title.className = "title";
        const subtitle = document.createElement("p");
        subtitle.innerHTML = node.attrs.subtitle;
        subtitle.className = 'subtitle'
        if(node.attrs.image){
          const image = document.createElement("img");
          image.src = node.attrs.image;
          image.className = 'post-image'
          return [
            "a",
            {
              href: node.attrs.href,
              rel: "noopener noreferrer nofollow",
              class: "card post-card"
            },
            image,
            ["div", { class: "post-text-content"}, title, subtitle],
          ]
        } else {
          return [
            "a",
            {
              href: node.attrs.href,
              rel: "noopener noreferrer nofollow",
              class: "card post-card"
            },
            title,
            subtitle,
          ]
        }
      },
    };
  }

  inputRules({ type }) {
    return [
      new InputRule(LINK_PREVIEW_INPUT_REGEX, (state, match, start, end) => {
        const [okay, title, subtitle, image, href] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, this.editor.schema.text(title)).addMark(
            start,
            start + title.length,
            type.create({ href })
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
    state.write("[{[" + node.attrs.title + "], [" + node.attrs.subtitle + "], [" + node.attrs.image + "]}]("+ node.attrs.href +")");
    state.write("\n\n");
  }

  parseMarkdown() {
    return {
      node: "link_with_preview",
      getAttrs: tok => ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null,
        subtitle: tok.attrGet("subtitle") || null,
        image: tok.attrGet("image") || null,
      }),
    };
  }
}
