import { glob } from "glob";
import fs from "fs-extra";
import postcss from "postcss";
import prefixer from "autoprefixer";
import preset from "postcss-preset-env";
import nano from "cssnano";
import tailwind from "tailwindcss";
import path from "path";

//@ts-expect-error there are no typings for this library.
import sass from "@csstools/postcss-sass";

import { Context, Styles } from "../Context.js";
import { generateHashFromContent } from "../helper/hash.js";

const prodProcessor = postcss(
  sass({
    silenceDeprecations: ["legacy-js-api"],
    api: "modern",
  }),
  tailwind(),
  preset(),
  prefixer(),
  nano(),
);

const debugProcessor = postcss(
  sass({
    silenceDeprecations: ["legacy-js-api"],
    api: "modern",
  }),
  tailwind(),
  preset(),
  prefixer(),
);

const generateStyle = async (
  obj: {
    path: string;
    content: string;
  },
  ctx: Context,
): Promise<{
  path: string;
  style: string;
}> => {
  const processor = ctx.mode === "production" ? prodProcessor : debugProcessor;

  const css = await processor.process(obj.content, {
    from: obj.path,
    to: "dist/webpage/",
  });

  let result = css.toString();
  for (const [name, key] of Object.entries(ctx.staticFonts)) {
    result = result.replaceAll(name, key);
  }

  return {
    path: obj.path,
    style: result,
  };
};

const writeStyle = async (
  obj: {
    path: string;
    style: string;
  },
  ctx: Context,
): Promise<{ key: string; file: string }> => {
  const base = generateHashFromContent(obj.style);

  const target = path.join(
    ctx.outputDirectory,
    "static",
    "styles",
    `${base}.css`,
  );

  await fs.writeFile(target, obj.style);
  return {
    key: path.basename(obj.path, ".scss"),
    file: `/static/styles/${base}.css`,
  };
};

export const generateStyles = async (ctx: Context): Promise<Styles> => {
  const paths = await glob("webpage/**/[^_]*.[s]css");
  await fs.ensureDir(path.join(ctx.outputDirectory, "static", "styles"));

  const files = await Promise.all(
    paths.map(async (path) => ({
      path: path,
      content: await fs.readFile(path, "utf-8"),
    })),
  );

  const styles = await Promise.all(
    files.map((file) => generateStyle(file, ctx)),
  );

  const generated = await Promise.all(
    styles.map((style) => writeStyle(style, ctx)),
  );
  return generated.reduce<Styles>((acc, next) => {
    acc[next.key] = next.file;
    return acc;
  }, {});
};
