import path from "path";
import fs from "fs-extra";

import { GenerationContext } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type NotFound = object;

export const generateAboutUs = async (
  ctx: GenerationContext,
): Promise<void> => {
  const html = await renderTemplate<NotFound>(
    "webpage/about.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["about"],
      slug: "about",
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "about"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "about", "index.html"),
    html,
  );
};
