import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import linkify from "marked-linkify-it";
import hljs from "highlight.js";
// import footnote from "marked-footnote";
import alert from "marked-alert";
// @ts-expect-error No Typing available
import table from "marked-extended-tables";

// TODO: AJ: 2024.12.13: Footnote throws an exception. No idea why, disabling
// for now.

const marked = new Marked({
  async: true,
  gfm: true,
  pedantic: false,
})
  // .use(footnote())
  .use(linkify())
  .use(gfmHeadingId())
  .use(alert())
  .use(table())
  .use(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
  );

export const renderMarkdown = async (markdown: string): Promise<string> => {
  const rendered = await marked.parse(markdown);
  return rendered;
};
