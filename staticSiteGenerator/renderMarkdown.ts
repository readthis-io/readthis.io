import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { gfmHeadingId } from "marked-gfm-heading-id";
import linkify from "marked-linkify-it";
import hljs from "highlight.js";
// import footnote from "marked-footnote";
import alert from "marked-alert";
// @ts-expect-error No Typing available
import table from "marked-extended-tables";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto-js";
import slugify from "slugify";

const generateHash = (name: string) => {
  const content = fs.readFileSync(name);
  const step1 = crypto.SHA512(crypto.lib.WordArray.create(content));
  const step2 = crypto.enc.Base64.stringify(step1);
  const step3 = step2.substring(0, 18);
  const step4 = slugify.default(step3);
  return step4;
};

export const renderMarkdown = async (
  markdown: string,
  srcDir: string,
): Promise<string> => {
  const marked = new Marked({
    async: true,
    gfm: true,
    pedantic: false,
  })
    // TODO: AJ: 2024.12.13: Footnote throws an exception. No idea why, disabling
    // for now.
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
    )
    .use({
      renderer: {
        image: (decl) => {
          const name = generateHash(path.join(srcDir, decl.href));
          const ext = path.extname(decl.href);
          fs.ensureDirSync(path.dirname("dist/webpage/static/images"));
          fs.copySync(
            path.join(srcDir, decl.href),
            path.join("dist/webpage/static/images", `${name}${ext}`),
          );
          return `<img src="/static/images/${name}${ext}" title="${decl.title}" alt="${decl.text}"/>`;
        },
      },
    });

  const rendered = await marked.parse(markdown);
  return rendered;
};
