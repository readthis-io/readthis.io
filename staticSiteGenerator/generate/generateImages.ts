import path from "path";
import fs from "fs-extra";
import { glob } from "glob";

import { Context, Images } from "../Context.js";
import { generateHashFromFile } from "../helper/hash.js";

export const generateImages = async (context: Context): Promise<Images> => {
  const imagePaths = await glob(
    "webpage/images/**/*.{jpg,jpeg,png,gif,webp,svg,ico}",
  );

  const targetPath = path.join(context.outputDirectory, "static", "images");
  await fs.ensureDir(targetPath);

  const generateImage = async (
    imagePath: string,
  ): Promise<{ key: string; hash: string }> => {
    const hash = await generateHashFromFile(imagePath);
    const ext = path.extname(imagePath);
    const target = path.join(targetPath, `${hash}${ext}`);
    await fs.copy(imagePath, target);

    return {
      key: path.relative("webpage/images", imagePath),
      hash: `/static/images/${hash}${ext}`,
    };
  };

  const generated = await Promise.all(imagePaths.map(generateImage));
  return generated.reduce<Images>((acc, next) => {
    acc[next.key] = next.hash;
    return acc;
  }, {});
};
