import path from "path";
import fs from "fs-extra";
import { glob } from "glob";
import sharp from "sharp";
import crypto from "crypto-js";

import { GenerationContext, Images } from "../Context.js";
import {
  generateHashFromContent,
  generateHashFromFile,
} from "../helper/hash.js";

const optimizeImage = async (
  imagePath: string,
  targetSize: number,
  targetPath: string,
): Promise<String> => {
  const imageBuffer = await sharp(imagePath)
    .resize(targetSize)
    .toFormat("webp")
    .toBuffer();
  const hash = generateHashFromContent(
    crypto.lib.WordArray.create(imageBuffer),
  );

  const target = path.join(targetPath, `${hash}.webp`);
  await fs.writeFile(target, imageBuffer);
  return hash;
};

const processPath = async (
  source: string,
  ctx: GenerationContext,
): Promise<
  {
    key: string;
    srcHash: string;
    srcsetHash: string;
  }[]
> => {
  const imagePaths = await glob([
    `${source}/**/*.{jpg,jpeg,png,gif,webp}`,
    `${source}/**/*.{svg,ico}`,
  ]);

  const targetPath = path.join(ctx.outputDirectory, "static", "images");
  await fs.ensureDir(targetPath);

  const generateImage = async (
    imagePath: string,
  ): Promise<{ key: string; srcHash: string; srcsetHash: string }> => {
    const ext = path.extname(imagePath).toLowerCase();

    if (ext === ".svg" || ext === ".ico") {
      const hash = await generateHashFromFile(imagePath);
      const target = path.join(targetPath, `${hash}${ext}`);
      await fs.copyFile(imagePath, target);
      return {
        key: path.relative(source, imagePath),
        srcHash: `/static/images/${hash}${ext}`,
        srcsetHash: `/static/images/${hash}${ext}`,
      };
    } else {
      const img1 = await optimizeImage(imagePath, 320, targetPath);
      const img2 = await optimizeImage(imagePath, 640, targetPath);
      const img3 = await optimizeImage(imagePath, 1280, targetPath);

      return {
        key: path.relative(source, imagePath),
        srcHash: `/static/images/${img1}.webp`,
        srcsetHash: `/static/images/${img1}.webp 320w, /static/images/${img2}.webp 640w, /static/images/${img3}.webp 1280w`,
      };
    }
  };

  const generated = await Promise.all(
    imagePaths.map(async (imagePath) => {
      try {
        return await generateImage(imagePath);
      } catch (error) {
        console.error(
          `Skipping image ${imagePath} due to error:`,
          error.message,
        );
        return null;
      }
    }),
  );

  return generated.filter(Boolean);
};

export const generateImages = async (
  context: GenerationContext,
): Promise<Images> => {
  return [
    ...(await processPath("webpage/images", context)),
    ...(await processPath("blog/", context)),
  ].reduce<Images>((acc, next) => {
    acc[next.key] = { src: next.srcHash, srcset: next.srcsetHash };
    return acc;
  }, {});
};
