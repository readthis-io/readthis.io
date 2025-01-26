import path from "path";
import fs from "fs-extra";
import { glob } from "glob";

import { Context, Fonts } from "../Context.js";
import { generateHashFromFile } from "../helper/hash.js";

const generateFont = async (
  fontPath: string,
  ctx: Context,
): Promise<{ key: string; name: string }> => {
  const base = path.basename(fontPath);
  const targetName = `${await generateHashFromFile(fontPath)}${path.extname(base)}`;
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
