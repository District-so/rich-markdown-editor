import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
export default class LinkPreview extends Node {
    get name(): string;
    get schema(): {
        attrs: {
            href: {
                default: string;
            };
            title: {
                default: string;
            };
            id: {
                default: string;
            };
            subtitle: {
                default: string;
            };
            image: {
                default: string;
            };
            event_obj: {
                default: null;
            };
        };
        content: string;
        group: string;
        inclusive: boolean;
        draggable: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                href: string | null;
                id: string | null;
                title: string | null;
                subtitle: string | null;
                image: string | null;
                event_obj: string | null;
            };
        }[];
        toDOM: (node: any) => (string | {
            href: any;
            rel: string;
            class: string;
        })[];
    };
    inputRules({ type }: {
        type: any;
    }): InputRule<any>[];
    commands({ type }: {
        type: any;
    }): ({ href }?: {
        href: string;
    }) => (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    get plugins(): Plugin<any, any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (tok: any) => {
            href: any;
            title: any;
            id: any;
            subtitle: any;
            image: any;
            event_obj: any;
        };
    };
}
//# sourceMappingURL=LinkPreview.d.ts.map