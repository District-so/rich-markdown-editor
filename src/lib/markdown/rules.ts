import markdownit from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markPlugin from "./mark";
import checkboxPlugin from "./checkboxes";
import embedsPlugin from "./embeds";
import breakPlugin from "./breaks";
import tablesPlugin from "./tables";
import noticesPlugin from "./notices";
import linkPreviewPlugin from "./link_previews";
import buttonsPlugin from "./buttons";
import underlinesPlugin from "./underlines";

export default function rules({ embeds }) {
  return markdownit("default", {
    breaks: false,
    html: false,
  })
    .use(markdownItAttrs, {
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: [] // empty array = all attributes are allowed
    })
    .use(embedsPlugin(embeds))
    .use(linkPreviewPlugin)
    .use(buttonsPlugin)
    .use(breakPlugin)
    .use(checkboxPlugin)
    .use(markPlugin({ delim: "==", mark: "mark" }))
    .use(markPlugin({ delim: "!!", mark: "placeholder" }))
    .use(underlinesPlugin)
    .use(tablesPlugin)
    .use(noticesPlugin);
}
