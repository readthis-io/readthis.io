import path from "path";
import fs from "fs-extra";

import { Category, Context } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";
import { BlogEntry } from "../BlogEntry.js";

interface CategoryParameter {
  entries: BlogEntry[];
  total: number;
  category: string;
  current: number;
}

function* splitInChunks<T>(arr: T[], chunkSize: number): Generator<T[]> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

const renderCategory = async (
  category: Category,
  chunks: BlogEntry[][],
  ctx: Context,
) => {
  const html = await renderTemplate<CategoryParameter>(
    "webpage/category.njk",
    {
      heading: `ReadThis- ${category.category}`,
      title: `ReadThis - ${category.category}`,
      styles: ["category"],
      category: category.category,
      entries: chunks[0],
      current: 1,
      total: chunks.length,
    },
    ctx,
  );

  await fs.ensureDir(path.join(ctx.outputDirectory, "category", category.slug));
  await fs.writeFile(
    path.join(ctx.outputDirectory, "category", category.slug, "index.html"),
    html,
  );
};

const renderPagination = async (
  category: Category,
  chunks: BlogEntry[][],
  ctx: Context,
) => {
  for (let page = 0; page < chunks.length; page++) {
    const html = await renderTemplate<CategoryParameter>(
      "webpage/category.njk",
      {
        heading: `ReadThis- ${category.category}`,
        title: `ReadThis - ${category.category}`,
        styles: ["category"],
        category: category.category,
        entries: chunks[page],
        current: page + 1,
        total: chunks.length,
      },
      ctx,
    );

    await fs.ensureDir(
      path.join(
        ctx.outputDirectory,
        "category",
        category.slug,
        (page + 1).toString(),
      ),
    );
    await fs.writeFile(
      path.join(
        ctx.outputDirectory,
        "category",
        category.slug,
        (page + 1).toString(),
        "index.html",
      ),
      html,
    );
  }
};

export const generateCategories = async (ctx: Context): Promise<void> => {
  for (const category of ctx.categories) {
    const chunks = [...splitInChunks(category.entries, ctx.blogsPerPage)];
    await renderCategory(category, chunks, ctx);
    await renderPagination(category, chunks, ctx);
  }
};
