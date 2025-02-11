import path from "path";
import fs from "fs-extra";

import { GenerationContext } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type NotFound = object;

export const generateNotFound = async (
  ctx: GenerationContext,
): Promise<void> => {
  const html = await renderTemplate<NotFound>(
    "webpage/notFound.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["notFound"],
      slug: "not-found",
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "not-found"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "not-found", "index.html"),
    html,
  );
};
