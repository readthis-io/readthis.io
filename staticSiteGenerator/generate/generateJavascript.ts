import { glob } from "glob";
import fs from "fs-extra";
import path from "path";
import uglify from "uglify-js";

import { Scripts, StyleGenerationContext, Styles } from "../Context.js";
import { generateHashFromContent } from "../helper/hash.js";

const generateScript = async (
  obj: {
    path: string;
    content: string;
  },
  ctx: StyleGenerationContext,
): Promise<{
  path: string;
  script: string;
}> => {
  const result =
    ctx.mode === "production" ? uglify.minify(obj.content).code : obj.content;

  return {
    path: obj.path,
    script: result,
  };
};

const writeScript = async (
  obj: {
    path: string;
    script: string;
  },
  ctx: StyleGenerationContext,
): Promise<{ key: string; file: string }> => {
  const base = generateHashFromContent(obj.script);

  const target = path.join(
    ctx.outputDirectory,
    "static",
    "scripts",
    `${base}.js`,
  );

  await fs.writeFile(target, obj.script);
  return {
    key: path.basename(obj.path, ".js"),
    file: `/static/scripts/${base}.js`,
  };
};

export const generateJavascript = async (
  ctx: StyleGenerationContext,
): Promise<Scripts> => {
  const paths = await glob("webpage/**/*.js");
  await fs.ensureDir(path.join(ctx.outputDirectory, "static", "scripts"));

  const files = await Promise.all(
    paths.map(async (path) => ({
      path: path,
      content: await fs.readFile(path, "utf-8"),
    })),
  );

  const scripts = await Promise.all(
    files.map((file) => generateScript(file, ctx)),
  );

  const generated = await Promise.all(
    scripts.map((script) => writeScript(script, ctx)),
  );
  return generated.reduce<Styles>((acc, next) => {
    acc[next.key] = next.file;
    return acc;
  }, {});
};
