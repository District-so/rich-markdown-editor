import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Mark from "./Mark";
export default class Button extends Mark {
    get styleOptions(): [string, any][];
    get name(): string;
    get schema(): {
        attrs: {
            href: {
                default: string;
            };
            title: {
                default: string;
            };
            style: {
                default: string;
            };
        };
        inclusive: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                href: string | null;
                title: string | null;
                style: string | null;
            };
        }[];
        toDOM: (node: any) => any[];
    };
    inputRules({ type }: {
        type: any;
    }): InputRule<any>[];
    commands({ type }: {
        type: any;
    }): ({ href }?: {
        href: string;
    }) => (state: import("prosemirror-state").EditorState<any>, dispatch?: ((tr: import("prosemirror-state").Transaction<any>) => void) | undefined) => boolean;
    handleStyleChange: (event: any) => void;
    get plugins(): Plugin<any, any>[];
    get toMarkdown(): {
        open(_state: any, mark: any, parent: any, index: any): "[" | "<";
        close(state: any, mark: any, parent: any, index: any): string;
    };
    parseMarkdown(): {
        mark: string;
        getAttrs: (tok: any) => {
            href: any;
            style: any;
            title: any;
        };
    };
}
//# sourceMappingURL=Button.d.ts.map