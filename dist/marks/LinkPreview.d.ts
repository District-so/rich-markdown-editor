import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Mark from "./Mark";
export default class LinkPreview extends Mark {
    get name(): string;
    get schema(): {
        attrs: {
            href: {
                default: string;
            };
            subtitle: {
                default: string;
            };
            image: {
                default: string;
            };
        };
        inclusive: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                href: string | null;
                subtitle: string | null;
                image: string | null;
            };
        }[];
        toDOM: (node: any) => (string | HTMLImageElement | {
            href: any;
            rel: string;
            class: string;
        } | (string | HTMLParagraphElement | {
            class: string;
        } | (string | number | {
            class: string;
        })[])[])[] | (string | HTMLParagraphElement | {
            href: any;
            rel: string;
            class: string;
        } | (string | number | {
            class: string;
        })[])[];
    };
    inputRules({ type }: {
        type: any;
    }): InputRule<any>[];
    commands({ type }: {
        type: any;
    }): ({ href }?: {
        href: string;
    }) => (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    keys({ type }: {
        type: any;
    }): {
        "Mod-k": (state: any, dispatch: any) => boolean;
    };
    get plugins(): Plugin<any, any>[];
    get toMarkdown(): {
        open(_state: any, mark: any, parent: any, index: any): "[" | "<";
        close(state: any, mark: any, parent: any, index: any): string;
    };
    parseMarkdown(): {
        mark: string;
        getAttrs: (tok: any) => {
            href: any;
            title: any;
        };
    };
}
//# sourceMappingURL=LinkPreview.d.ts.map