/// <reference types="react" />
import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
export default class Image extends Node {
    get alignmentOptions(): [string, any][];
    get alignmentStyles(): {
        center: {
            display: string;
            maxWidth: string;
            maxHeight: string;
        };
        full_width: {
            display: string;
            width: string;
            maxHeight: string;
        };
        thumbnail: {
            display: string;
            maxWidth: string;
            maxHeight: string;
        };
    };
    get name(): string;
    get schema(): {
        inline: boolean;
        attrs: {
            src: {};
            alignment: {
                default: string;
            };
            alt: {
                default: null;
            };
        };
        content: string;
        marks: string;
        group: string;
        selectable: boolean;
        draggable: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                src: string | null;
                alt: string;
            };
        }[];
        toDOM: (node: any) => (string | {
            class: string;
        } | (string | any[] | {
            class: string;
        })[] | (string | number | {
            class: string;
        })[])[];
    };
    handleAlignmentChange: ({ node, getPos }: {
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
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (token: any) => {
            src: any;
            alignment: any;
            alt: any;
        };
    };
    commands({ type }: {
        type: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    inputRules({ type }: {
        type: any;
    }): InputRule<any>[];
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=Image.d.ts.map