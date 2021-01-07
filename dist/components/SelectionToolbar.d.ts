import * as React from "react";
import { EditorView } from "prosemirror-view";
import { SearchResult } from "./LinkEditor";
import baseDictionary from "../dictionary";
declare type Props = {
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
export default class SelectionToolbar extends React.Component<Props> {
    handleOnCreateLink: (title: string) => Promise<false | undefined>;
    handleOnSelectLink: ({ href, title, id, subtitle, image, event, }: {
        href: string;
        title?: string | undefined;
        id?: string | undefined;
        subtitle?: string | undefined;
        image?: string | undefined;
        event?: any;
    }) => void;
    render(): JSX.Element | null;
}
export {};
//# sourceMappingURL=SelectionToolbar.d.ts.map