/// <reference types="react" />
import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
export default class Button extends Node {
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
        content: string;
        group: string;
        inclusive: boolean;
        selectable: boolean;
        draggable: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                href: string | null;
                title: string | null;
                style: string | null;
            };
        }[];
        toDOM: (node: any) => (string | {
            class: string;
        } | (string | HTMLSelectElement | {
            contentEditable: boolean;
        })[] | (string | number | {
            href: any;
            rel: string;
            class: string;
        })[])[];
    };
    handleStyleChange: ({ node, getPos }: {
        node: any;
        getPos: any;
    }) => (event: any) => void;
    handleKeyDown: ({ node, getPos }: {
        node: any;
        getPos: any;
    }) => (event: any) => void;
    handleBlur: ({ node, getPos }: {
        node: any;
        getPos: any;
    }) => (event: any) => void;
    handleSelect: ({ getPos }: {
        getPos: any;
    }) => (event: any) => void;
    component: (props: any) => JSX.Element;
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
            style: any;
            title: any;
        };
    };
}
//# sourceMappingURL=Button.d.ts.map