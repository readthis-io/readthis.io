import path from "path";
import fs from "fs-extra";

import { Context } from "./Context.js";
import { BlogEntry } from "./BlogEntry.js";
import { renderTemplate } from "./renderTemplate.js";

interface BlogParameter {
  blog: string;
  topic: string;
  tags: string[];
  title: string;
}

const generateBlogEntry = async (
  entry: BlogEntry,
  ctx: Context,
): Promise<void> => {
  const html = await renderTemplate<BlogParameter>(
    "webpage/blog.njk",
    {
      heading: entry.title,
      title: entry.title,
      styles: ["blog.css"],
      blog: entry.html,
      tags: entry.tags,
      topic: entry.topic,
    },
    ctx.mode === "production" ? "Minify" : "Do Not Minify",
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "blog", entry.slug));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "blog", entry.slug, "index.html"),
    html,
  );
};

export const generateBlogEntries = async (ctx: Context) => {
  await Promise.all(ctx.entries.map((entry) => generateBlogEntry(entry, ctx)));
};
