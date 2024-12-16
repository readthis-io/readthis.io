import path from "path";
import fs from "fs-extra";

import { Context } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type NotFound = object;

export const generateNotFound = async (ctx: Context): Promise<void> => {
  const html = await renderTemplate<NotFound>(
    "webpage/notFound.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["notFound.css"],
      ...ctx,
    },
    ctx.mode === "production" ? "Minify" : "Do Not Minify",
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "not-found"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "not-found", "index.html"),
    html,
  );
};
