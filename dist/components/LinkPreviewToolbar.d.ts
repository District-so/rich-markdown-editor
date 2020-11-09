import * as React from "react";
import { EditorView } from "prosemirror-view";
import { SearchResult } from "./LinkEditor";
import baseDictionary from "../dictionary";
declare type Props = {
    isActive: boolean;
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
    handleOnSelectLink: ({ href, title, subtitle, image, }: {
        href: string;
        title: string;
        subtitle?: string | undefined;
        image?: string | undefined;
        from: number;
        to: number;
    }) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=LinkPreviewToolbar.d.ts.map