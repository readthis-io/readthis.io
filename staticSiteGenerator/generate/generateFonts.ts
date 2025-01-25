import path from "path";
import fs from "fs-extra";
import { glob } from "glob";
import crypto from "crypto-js";
import slugify from "slugify";

import { Context, Fonts } from "../Context.js";

const generateHash = async (name: string) => {
  const content = await fs.readFile(name);
  const step1 = crypto.SHA512(crypto.lib.WordArray.create(content));
  const step2 = crypto.enc.Base64.stringify(step1);
  const step3 = step2.substring(0, 18);
  const step4 = slugify.default(step3);
  return step4;
};

const generateFont = async (
  fontPath: string,
  ctx: Context,
): Promise<{ key: string; name: string }> => {
  const base = path.basename(fontPath);
  const targetName =
    // ctx.mode === "debug"
    //   ? base
    //   :
    `${await generateHash(fontPath)}${path.extname(base)}`;
  const targetPath = path.join(
    ctx.outputDirectory,
    "static",
    "fonts",
    targetName,
  );

  await fs.copy(fontPath, targetPath);

  return {
    key: base,
    name: `/static/fonts/${targetName}`,
  };
};

export const generateFonts = async (ctx: Context): Promise<Fonts> => {
  const fontPaths = await glob("webpage/**/fonts/**/*.woff2");

  await fs.ensureDir(path.join(ctx.outputDirectory, "static", "fonts"));

  const generated = await Promise.all(
    fontPaths.map((fontPath) => generateFont(fontPath, ctx)),
  );
  return generated.reduce<Fonts>((acc, next) => {
    acc[next.key] = next.name;
    return acc;
  }, {});
};
