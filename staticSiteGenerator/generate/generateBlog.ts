import path from "path";
import fs from "fs-extra";

import { GenerationContext } from "../Context.js";
import { BlogEntry } from "../BlogEntry.js";
import { renderTemplate } from "../renderTemplate.js";

interface BlogParameter {
  blog: string;
  topic: string;
  tags: string[];
  title: string;
  featuredImage?: string;
  author: string;
  readingTime: string;
}

const generateBlogEntry = async (
  entry: BlogEntry,
  ctx: GenerationContext,
): Promise<void> => {
  const html = await renderTemplate<BlogParameter>(
    "webpage/blog.njk",
    {
      heading: entry.title,
      title: entry.title,
      featuredImage: entry.featuredImage
        ? ctx.staticImages[entry.featuredImage]
        : ctx.staticImages[ctx.defaultFeatureImageKey],
      styles: ["blog"],
      blog: entry.html,
      tags: entry.tags,
      topic: entry.topic,
      author: entry.author,
      readingTime: entry.readingTime,
      slug: `blog/${entry.slug}`,
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "blog", entry.slug));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "blog", entry.slug, "index.html"),
    html,
  );
};

export const generateBlogEntries = async (ctx: GenerationContext) => {
  await Promise.all(ctx.entries.map((entry) => generateBlogEntry(entry, ctx)));
};
