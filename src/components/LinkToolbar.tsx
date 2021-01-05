import assert from "assert";
import * as React from "react";
import { EditorView } from "prosemirror-view";
import LinkEditor, { SearchResult } from "./LinkEditor";
import FloatingToolbar from "./FloatingToolbar";
import createAndInsertLink from "../commands/createAndInsertLink";
import baseDictionary from "../dictionary";

type Props = {
  activeState: number;
  view: EditorView;
  tooltip: typeof React.Component | React.FC<any>;
  dictionary: typeof baseDictionary;
  onCreateLink?: (title: string) => Promise<string>;
  onSearchLink?: (term: string) => Promise<SearchResult[]>;
  onClickLink: (href: string, event: MouseEvent) => void;
  onShowToast?: (msg: string, code: string) => void;
  onClose: () => void;
};

function isActive(props) {
  const { view } = props;
  const { selection } = view.state;

  const paragraph = view.domAtPos(selection.$from.pos);
  
  return (props.activeState > 0) && !!paragraph.node;
}

export default class LinkToolbar extends React.Component<Props> {
  menuRef = React.createRef<HTMLDivElement>();

  state = {
    left: -1000,
    top: undefined,
  };

  componentDidMount() {
    window.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = ev => {
    if (
      ev.target &&
      this.menuRef.current &&
      this.menuRef.current.contains(ev.target)
    ) {
      return;
    }

    this.props.onClose();
  };

  handleOnCreateLink = async (title: string) => {
    const { dictionary, onCreateLink, view, onClose, onShowToast } = this.props;

    onClose();
    this.props.view.focus();

    if (!onCreateLink) {
      return;
    }

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    assert(from === to);

    const href = `creating#${title}…`;

    var is_button = false;

    // Insert a placeholder link
    if(this.props.activeState == 1){
      dispatch(
        view.state.tr
          .insertText(title, from, to)
          .addMark(
            from,
            to + title.length,
            state.schema.marks.link.create({ href })
          )
      );
    } else if(this.props.activeState == 3) {
      is_button = true;
      dispatch(
        view.state.tr
          .insertText(title, from, to)
          .setBlockType(
            from,
            to + title.length,
            state.schema.nodes.button,
            { href, title }
          )
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
    image,
  }: {
    href: string;
    title: string;
    subtitle?: string;
    image?: string;
  }) => {
    const { view, onClose } = this.props;

    onClose();
    this.props.view.focus();

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    assert(from === to);

    if(this.props.activeState == 1 || (this.props.activeState == 2 && !subtitle && !image)){
      // simple link
      dispatch(
        view.state.tr
          .insertText(title, from, to)
          .addMark(
            from,
            to + title.length,
            state.schema.marks.link.create({ href })
          )
      );
    } else if(this.props.activeState == 2) {
      // link with preview
      dispatch(
        view.state.tr
          .insert(
            from,
            state.schema.nodes.link_with_preview.create({ href, title, subtitle, image })
          )
      );
    } else {
      // button
      dispatch(
        view.state.tr
          .insertText(title, from, to)
          .setBlockType(
            from,
            to + title.length,
            state.schema.nodes.button,
            { href, title }
          )
      );
      // dispatch(
      //   view.state.tr
      //     .insertText(title, from, to)
      //     .addMark(
      //       from,
      //       to + title.length,
      //       state.schema.marks.button.create({ href })
      //     )
      // );
    }
  };

  render() {
    const { onCreateLink, onClose, ...rest } = this.props;
    const selection = this.props.view.state.selection;

    return (
      <FloatingToolbar
        ref={this.menuRef}
        active={isActive(this.props)}
        {...rest}
      >
        {isActive(this.props) && (
          <LinkEditor
            from={selection.from}
            to={selection.to}
            onCreateLink={onCreateLink ? this.handleOnCreateLink : undefined}
            onSelectLink={this.handleOnSelectLink}
            onRemoveLink={onClose}
            {...rest}
          />
        )}
      </FloatingToolbar>
    );
  }
}
