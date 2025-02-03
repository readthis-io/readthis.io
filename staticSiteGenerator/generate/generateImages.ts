import path from "path";
import fs from "fs-extra";
import { glob } from "glob";

import { GenerationContext, Images } from "../Context.js";
import { generateHashFromFile } from "../helper/hash.js";

const processPath = async (
  source: string,
  ctx: GenerationContext,
): Promise<
  {
    key: string;
    hash: string;
  }[]
> => {
  const imagePaths = await glob([
    `${source}/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
    // "blog/**/*.{jpg,jpeg,png,gif,webp,svg,ico}",
  ]);

  const targetPath = path.join(ctx.outputDirectory, "static", "images");
  await fs.ensureDir(targetPath);

  const generateImage = async (
    imagePath: string,
  ): Promise<{ key: string; hash: string }> => {
    const hash = await generateHashFromFile(imagePath);
    const ext = path.extname(imagePath);
    const target = path.join(targetPath, `${hash}${ext}`);
    await fs.copy(imagePath, target);

    return {
      key: path.relative(source, imagePath),
      hash: `/static/images/${hash}${ext}`,
    };
  };

  const generated = await Promise.all(imagePaths.map(generateImage));
  return generated;
};

export const generateImages = async (
  context: GenerationContext,
): Promise<Images> => {
  return [
    ...(await processPath("webpage/images", context)),
    ...(await processPath("blog/", context)),
  ].reduce<Images>((acc, next) => {
    acc[next.key] = next.hash;
    return acc;
  }, {});
};
