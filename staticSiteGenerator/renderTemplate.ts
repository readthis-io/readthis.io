import path from "path";
import nun from "nunjucks";
import { minify } from "html-minifier";
import fs from "fs-extra";

import { GenerationContext } from "./Context.js";

/**
 * Parameters used in _frame.njk.
 */
export interface PageFrameParameter {
  styles: string[];
  title: string;
  heading: string;
}

export const renderTemplate = async <TTemplate>(
  fileName: string,
  data: TTemplate & PageFrameParameter,
  ctx: GenerationContext,
): Promise<string> => {
  const nunEnv = new nun.Environment(
    new nun.FileSystemLoader([path.resolve("webpage")]),
  );
  const file = await fs.readFile(fileName, "utf-8");
  const compiled = nunEnv.renderString(file, {
    ...ctx,
    ...data,
    styles: data.styles.map((style) => ctx.staticStyles[style]),
  });

  let result = compiled;
  for (const [name, key] of Object.entries(ctx.staticImages)) {
    result = result.replaceAll(name, key);
  }

  if (ctx.mode === "production") {
    const uglified = minify(result, {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      useShortDoctype: false,
      sortClassName: true,
      sortAttributes: true,
      removeTagWhitespace: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      removeRedundantAttributes: true,
      removeOptionalTags: false,
      removeEmptyElements: false,
      removeEmptyAttributes: false,
      removeComments: true,
      removeAttributeQuotes: false,
      processConditionalComments: false,
      preserveLineBreaks: false,
      minifyJS: true,
      minifyURLs: true,
      minifyCSS: true,
      keepClosingSlash: true,
      includeAutoGeneratedTags: true,
      html5: true,
    });

    return uglified;
  }

  return result;
};
