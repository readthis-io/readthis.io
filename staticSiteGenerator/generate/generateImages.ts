import path from "path";
import fs from "fs-extra";
import { glob } from "glob";

import { Context } from "../Context.js";

export const generateImages = async (context: Context): Promise<void> => {
  const imagePaths = await glob(
    "webpage/**/images/**/*.{jpg,jpeg,png,gif,webp,svg}",
  );

  await Promise.all(
    imagePaths.map(async (imagePath) => {
      const relativePath = imagePath.replace("webpage/", "");
      const targetPath = path.join(context.outputDirectory, relativePath);

      await fs.ensureDir(path.dirname(targetPath));

      await fs.copy(imagePath, targetPath);
    }),
  );
};
