import fs from "fs-extra";
import path from "path";

import { GenerationContext } from "../Context.js";

export const generateFavIcon = async (
  ctx: GenerationContext,
): Promise<void> => {
  await fs.copy(
    "webpage/images/favicon/favicon.ico",
    path.join(ctx.outputDirectory, "favicon.ico"),
  );
};
