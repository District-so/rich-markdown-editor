import { EditorView } from "prosemirror-view";
import baseDictionary from "../dictionary";
import { ToastType } from "../types";

function findPlaceholderLink(doc, href) {
  let result;

  function findLinks(node, pos = 0) {
    // get text nodes
    if (node.type.name === "text") {
      // get marks for text nodes
      node.marks.forEach(mark => {
        // any of the marks links?
        if (mark.type.name === "link") {
          // any of the links to other docs?
          if (mark.attrs.href === href) {
            result = { node, pos };
            if (result) return false;
          }
        }
      });
    }

    if (!node.content.size) {
      return;
    }

    node.descendants(findLinks);
  }

  findLinks(doc);
  return result;
}

function findPlaceholderButton(state, href) {
  let result;

  function findButtonNodes(node, pos = 0) {
    // get text nodes
    if (node.type == state.schema.nodes.button) {
      if(node.attrs.href === href){
        result = { node, pos };
      }
    }

    if (!node.content.size) {
      return;
    }

    node.descendants(findButtonNodes);
  }

  findButtonNodes(state.doc);
  return result;
}

const createAndInsertLink = async function(
  view: EditorView,
  title: string,
  href: string,
  is_button: boolean,
  options: {
    dictionary: typeof baseDictionary;
    onCreateLink: (title: string) => Promise<string>;
    onShowToast?: (message: string, code: string) => void;
  }
) {
  const { dispatch, state } = view;
  const { onCreateLink, onShowToast } = options;

  try {
    const url = await onCreateLink(title);
    if(is_button){
      const result = findPlaceholderButton(state, href);
      if (!result) return;

      dispatch(
        view.state.tr
          .setBlockType(
            result.pos,
            result.pos + result.node.attrs.title,
            state.schema.nodes.button,
            { 
              href: url, 
              title: result.node.attrs.title, 
              style: result.node.attrs.style 
            }
          )
      );

    } else {
      const result = findPlaceholderLink(view.state.doc, href);

      if (!result) return;

      dispatch(
        view.state.tr
          .removeMark(
            result.pos,
            result.pos + result.node.nodeSize,
            state.schema.marks.link
          )
          .addMark(
            result.pos,
            result.pos + result.node.nodeSize,
            state.schema.marks.link.create({ href: url })
          )
      );
    }
    
  } catch (err) {
    const result = findPlaceholderLink(view.state.doc, href);
    if (!result) return;

    dispatch(
      view.state.tr.removeMark(
        result.pos,
        result.pos + result.node.nodeSize,
        state.schema.marks.link
      )
    );

    // let the user know
    if (onShowToast) {
      onShowToast(options.dictionary.createLinkError, ToastType.Error);
    }
  }
};

export default createAndInsertLink;
