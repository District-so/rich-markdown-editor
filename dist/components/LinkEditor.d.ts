import * as React from "react";
import { EditorView } from "prosemirror-view";
import { Mark, Node } from "prosemirror-model";
import theme from "../theme";
import baseDictionary from "../dictionary";
export declare type SearchResult = {
    title: string;
    id?: string;
    subtitle?: string;
    image?: string;
    url: string;
    event_obj?: any;
};
declare type Props = {
    mark?: Mark;
    node?: Node;
    from: number;
    to: number;
    tooltip: typeof React.Component | React.FC<any>;
    dictionary: typeof baseDictionary;
    onRemoveLink?: () => void;
    onCreateLink?: (title: string) => Promise<void>;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onSelectLink: (options: {
        href: string;
        title?: string;
        id?: string;
        subtitle?: string;
        image?: string;
        event_obj?: any;
    }) => void;
    onClickLink: (href: string, event: MouseEvent) => void;
    onShowToast?: (message: string, code: string) => void;
    view: EditorView;
    theme: typeof theme;
};
declare type State = {
    results: {
        [keyword: string]: SearchResult[];
    };
    value: string;
    previousValue: string;
    selectedIndex: number;
};
declare class LinkEditor extends React.Component<Props, State> {
    discardInputValue: boolean;
    initialValue: string;
    initialSelectionLength: number;
    state: State;
    get href(): string;
    get suggestedLinkTitle(): string;
    componentWillUnmount: () => void;
    save: (href: string, title?: string | undefined, id?: string | undefined, subtitle?: string | undefined, image?: string | undefined, event_obj?: any) => void;
    handleKeyDown: (event: React.KeyboardEvent<Element>) => void;
    handleFocusLink: (selectedIndex: number) => void;
    handleChange: (event: any) => Promise<void>;
    handleOpenLink: (event: any) => void;
    handleCreateLink: (value: string) => Promise<void> | undefined;
    handleRemoveLink: () => void;
    handleSelectLink: (url: string, title?: string | undefined, id?: string | undefined, subtitle?: string | undefined, image?: string | undefined, event_obj?: any) => (event: any) => void;
    moveSelectionToEnd: () => void;
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props & React.RefAttributes<LinkEditor>, "mark" | "view" | "tooltip" | "ref" | "from" | "to" | "key" | "node" | "dictionary" | "onRemoveLink" | "onCreateLink" | "onSearchLink" | "onSelectLink" | "onClickLink" | "onShowToast"> & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=LinkEditor.d.ts.map