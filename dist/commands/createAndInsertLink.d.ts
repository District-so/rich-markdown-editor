import { EditorView } from "prosemirror-view";
declare const createAndInsertLink: (view: EditorView<any>, title: string, href: string, is_button: boolean, options: {
    dictionary: {
        addColumnAfter: string;
        addColumnBefore: string;
        addRowAfter: string;
        addRowBefore: string;
        alignCenter: string;
        alignLeft: string;
        alignRight: string;
        bulletList: string;
        button: string;
        checkboxList: string;
        codeBlock: string;
        codeCopied: string;
        codeInline: string;
        createLink: string;
        createLinkError: string;
        createNewDoc: string;
        danger: string;
        dangerNotice: string;
        dark: string;
        deleteColumn: string;
        deleteRow: string;
        deleteTable: string;
        em: string;
        embedInvalidLink: string;
        findOrCreateDoc: string;
        h1: string;
        h2: string;
        h3: string;
        heading: string;
        hr: string;
        image: string;
        imageUploadError: string;
        info: string;
        infoNotice: string;
        light: string;
        link: string;
        linkCopied: string;
        linkPreview: string;
        mark: string;
        newLineEmpty: string;
        newLineWithSlash: string;
        noResults: string;
        openLink: string;
        orderedList: string;
        pasteLink: string;
        pasteLinkWithTitle: (title: string) => string;
        placeholder: string;
        primary: string;
        quote: string;
        removeLink: string;
        searchOrPasteLink: string;
        secondary: string;
        secondaryNotice: string;
        strikethrough: string;
        strong: string;
        subheading: string;
        success: string;
        successNotice: string;
        table: string;
        tip: string;
        tipNotice: string;
        warning: string;
        warningNotice: string;
        white: string;
    };
    onCreateLink: (title: string) => Promise<string>;
    onShowToast?: ((message: string, code: string) => void) | undefined;
}) => Promise<void>;
export default createAndInsertLink;
//# sourceMappingURL=createAndInsertLink.d.ts.map