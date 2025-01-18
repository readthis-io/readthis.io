import path from "path";
import fs from "fs-extra";
import { glob } from "glob";

import { Context } from "../Context.js";

export const generateFonts = async (context: Context): Promise<void> => {
  const fontPaths = await glob("webpage/**/fonts/**/*.woff2");

  await Promise.all(
    fontPaths.map(async (fontPath) => {
      const relativePath = fontPath.replace("webpage/", "");
      const targetPath = path.join(context.outputDirectory, relativePath);

      await fs.ensureDir(path.dirname(targetPath));

      await fs.copy(fontPath, targetPath);
    }),
  );
};
