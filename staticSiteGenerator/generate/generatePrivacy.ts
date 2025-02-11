import path from "path";
import fs from "fs-extra";

import { GenerationContext } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type PrivacyPage = object;

export const generatePrivacy = async (
  ctx: GenerationContext,
): Promise<void> => {
  const html = await renderTemplate<PrivacyPage>(
    "webpage/privacy.njk",
    {
      heading: "Data Privacy",
      title: "Data Privacy - ReadThis",
      styles: ["privacy"],
      slug: "privacy",
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "privacy"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "privacy", "index.html"),
    html,
  );
};
