import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import linkify from "marked-linkify-it";
import hljs from "highlight.js";
import footnote from "marked-footnote";
import alert from "marked-alert";
// @ts-expect-error No Typing available
import table from "marked-extended-tables";
import fs from "fs-extra";
import path from "path";

import { generateHashFromFileSync } from "./helper/hash.js";

export const renderMarkdown = async (
  markdown: string,
  srcDir: string,
): Promise<string> => {
  const marked = new Marked({
    async: true,
    gfm: true,
    pedantic: false,
  })
    .use(footnote())
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
    )
    .use({
      renderer: {
        image: (decl) => {
          const name = generateHashFromFileSync(path.join(srcDir, decl.href));
          const ext = path.extname(decl.href);
          const targetPath = path.join(
            "dist/webpage/static/images",
            `${name}${ext}`,
          );
          fs.ensureDirSync(path.dirname("dist/webpage/static/images"));
          fs.copySync(path.join(srcDir, decl.href), targetPath);
          return `<img src="/static/images/${name}${ext}" title="${decl.title}" alt="${decl.text}"/>`;
        },
      },
    });

  const rendered = await marked.parse(markdown);
  return rendered;
};
