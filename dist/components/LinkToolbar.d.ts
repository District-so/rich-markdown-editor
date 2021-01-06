import * as React from "react";
import { EditorView } from "prosemirror-view";
import { SearchResult } from "./LinkEditor";
import baseDictionary from "../dictionary";
declare type Props = {
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
export default class LinkToolbar extends React.Component<Props> {
    menuRef: React.RefObject<HTMLDivElement>;
    state: {
        left: number;
        top: undefined;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleClickOutside: (ev: any) => void;
    handleOnCreateLink: (title: string) => Promise<void>;
    handleOnSelectLink: ({ href, id, title, subtitle, image, event }: {
        href: string;
        id?: string | undefined;
        title?: string | undefined;
        subtitle?: string | undefined;
        image?: string | undefined;
        event?: any;
    }) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=LinkToolbar.d.ts.map