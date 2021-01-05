import assert from "assert";
import * as React from "react";
import { Portal } from "react-portal";
import { EditorView } from "prosemirror-view";
import getTableColMenuItems from "../menus/tableCol";
import getTableRowMenuItems from "../menus/tableRow";
import getTableMenuItems from "../menus/table";
import getFormattingMenuItems from "../menus/formatting";
import FloatingToolbar from "./FloatingToolbar";
import LinkEditor, { SearchResult } from "./LinkEditor";
import Menu from "./Menu";
import isMarkActive from "../queries/isMarkActive";
import getMarkRange from "../queries/getMarkRange";
import getNodeRange from "../queries/getNodeRange";
import isNodeActive from "../queries/isNodeActive";
import getColumnIndex from "../queries/getColumnIndex";
import getRowIndex from "../queries/getRowIndex";
import createAndInsertLink from "../commands/createAndInsertLink";
import { MenuItem } from "../types";
import baseDictionary from "../dictionary";

type Props = {
  dictionary: typeof baseDictionary;
  tooltip: typeof React.Component | React.FC<any>;
  isTemplate: boolean;
  commands: Record<string, any>;
  onSearchLink?: (term: string) => Promise<SearchResult[]>;
  onClickLink: (href: string, event: MouseEvent) => void;
  onCreateLink?: (title: string) => Promise<string>;
  onShowToast?: (msg: string, code: string) => void;
  view: EditorView;
};

function isActive(props) {
  const { view } = props;
  const { selection } = view.state;

  return selection && !selection.empty;
}

export default class SelectionToolbar extends React.Component<Props> {
  handleOnCreateLink = async (title: string) => {
    const { dictionary, onCreateLink, view, onShowToast } = this.props;

    if (!onCreateLink) {
      return;
    }

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    assert(from !== to);

    const href = `creating#${title}…`;
    const is_button = isNodeActive(state.schema.nodes.button)(state);
    
    // Insert a placeholder link
    if(is_button) {
      const range = getNodeRange(state.schema.nodes.button)(state)
      if (!range) return false;
      dispatch(
        view.state.tr
          .setBlockType(
            from,
            from + title.length,
            state.schema.nodes.button,
            { href, title, style: range.node.attrs.style }
          )
      );
    } else {
      const markType = state.schema.marks.link;
      dispatch(
        state.tr
          .removeMark(from, to, markType)
          .addMark(from, to, markType.create({ href }))
      );
    }

    createAndInsertLink(view, title, href, is_button, {
      onCreateLink,
      onShowToast,
      dictionary,
    });
  };

  handleOnSelectLink = ({
    href,
    title,
    subtitle,
    image
  }: {
    href: string;
    title: string;
    subtitle?: string;
    image?: string;
  }): void => {
    const { view } = this.props;
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    const is_button = isNodeActive(state.schema.nodes.button)(state);

    if(is_button) {
      const range = getNodeRange(state.schema.nodes.button)(state)
      const effectiveTitle = range.node.attrs.title ? range.node.attrs.title : title;
      dispatch(
        view.state.tr
          .setNodeMarkup(
            range.from,
            undefined,
            { href, title: effectiveTitle, style: range.node.attrs.style }
          )
      );
    } else {
      const markType = state.schema.marks.link;
      dispatch(
        state.tr
          .removeMark(from, to, markType)
          .addMark(from, to, markType.create({ href }))
      );
    }
    
  };

  render() {
    const { dictionary, onCreateLink, isTemplate, ...rest } = this.props;
    const { view } = rest;
    const { state } = view;
    const { selection }: { selection: any } = state;
    const isCodeSelection = isNodeActive(state.schema.nodes.code_block)(state);

    // toolbar is disabled in code blocks, no bold / italic etc
    if (isCodeSelection) {
      return null;
    }

    const colIndex = getColumnIndex(state.selection);
    const rowIndex = getRowIndex(state.selection);
    const isTableSelection = colIndex !== undefined && rowIndex !== undefined;
    const is_link = isMarkActive(state.schema.marks.link)(state);
    const is_button = isNodeActive(state.schema.nodes.button)(state);
    const range = is_link ? getMarkRange(selection.$from, state.schema.marks.link) : getNodeRange(state.schema.nodes.button)(state);

    let items: MenuItem[] = [];
    if (isTableSelection) {
      items = getTableMenuItems(dictionary);
    } else if (colIndex !== undefined) {
      items = getTableColMenuItems(state, colIndex, dictionary);
    } else if (rowIndex !== undefined) {
      items = getTableRowMenuItems(state, rowIndex, dictionary);
    } else {
      items = getFormattingMenuItems(state, isTemplate, dictionary);
    }

    if (!items.length) {
      return null;
    }

    return (
      <Portal>
        <FloatingToolbar view={view} active={isActive(this.props)}>
          {(is_link && range) || is_button ? (
            <LinkEditor
              dictionary={dictionary}
              node={range.node}
              mark={range.mark}
              from={range.from}
              to={range.to}
              onCreateLink={onCreateLink ? this.handleOnCreateLink : undefined}
              onSelectLink={this.handleOnSelectLink}
              {...rest}
            />
          ) : (
            <Menu items={items} {...rest} />
          )}
        </FloatingToolbar>
      </Portal>
    );
  }
}
