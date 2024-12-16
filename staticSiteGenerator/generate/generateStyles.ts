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

import { Context } from "../Context.js";

const prodProcessor = postcss(sass(), tailwind(), preset(), prefixer(), nano());

const debugProcessor = postcss(sass(), tailwind(), preset(), prefixer());

const generateStyle = async (
  obj: {
    path: string;
    content: string;
  },
  mode: "debug" | "production",
): Promise<{
  path: string;
  style: string;
}> => {
  const processor = mode === "production" ? prodProcessor : debugProcessor;

  const css = await processor.process(obj.content, {
    from: obj.path,
    to: "dist/webpage/",
  });
  return {
    path: obj.path,
    style: css.toString(),
  };
};

const writeStyle = async (
  obj: {
    path: string;
    style: string;
  },
  ctx: Context,
): Promise<void> => {
  const base = path.basename(obj.path, ".scss");
  const target = path.join(ctx.outputDirectory, `${base}.css`);

  await fs.writeFile(target, obj.style);
};

export const generateStyles = async (context: Context) => {
  const paths = await glob("webpage/**/[^_]*.[s]css");
  const files = await Promise.all(
    paths.map(async (path) => ({
      path: path,
      content: await fs.readFile(path, "utf-8"),
    })),
  );

  const styles = await Promise.all(
    files.map((file) => generateStyle(file, context.mode)),
  );

  await Promise.all(styles.map((style) => writeStyle(style, context)));
};
