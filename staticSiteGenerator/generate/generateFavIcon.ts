import fs from "fs-extra";
import path from "path";

import { Context } from "../Context.js";

export const generateFavIcon = async (ctx: Context): Promise<void> => {
  await fs.copy(
    "webpage/images/favicon/favicon.ico",
    path.join(ctx.outputDirectory, "favicon.ico"),
  );
};
