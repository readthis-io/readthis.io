import path from "path";
import fs from "fs-extra";

import { Context } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type NotFound = object;

export const generateImprint = async (ctx: Context): Promise<void> => {
  const html = await renderTemplate<NotFound>(
    "webpage/imprint.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["imprint.css"],
      ...ctx,
    },
    ctx.mode === "production" ? "Minify" : "Do Not Minify",
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "imprint"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "imprint", "index.html"),
    html,
  );
};
