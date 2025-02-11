import path from "path";
import fs from "fs-extra";

import { GenerationContext } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";

type ContactPage = object;

export const generateContact = async (
  ctx: GenerationContext,
): Promise<void> => {
  const html = await renderTemplate<ContactPage>(
    "webpage/contact.njk",
    {
      heading: "Contact Us",
      title: "Contact Us - ReadThis",
      styles: ["contact"],
      slug: "contact",
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "contact"));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "contact", "index.html"),
    html,
  );
};
