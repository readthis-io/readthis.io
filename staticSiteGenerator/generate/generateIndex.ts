import path from "path";
import fs from "fs-extra";

import { Context } from "../Context.js";
import { renderTemplate } from "../renderTemplate.js";
import { BlogEntry } from "../BlogEntry.js";

interface IndexParameter {
  blogs: BlogEntry[];
  total: number;
  current: number;
}

function* splitInChunks<T>(arr: T[], chunkSize: number): Generator<T[]> {
  for (let i = 0; i < arr.length; i += chunkSize) {
    yield arr.slice(i, i + chunkSize);
  }
}

const renderIndex = async (chunks: BlogEntry[][], ctx: Context) => {
  const html = await renderTemplate<IndexParameter>(
    "webpage/index.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["index.css"],
      blogs: chunks[0],
      current: 1,
      total: chunks.length,
      categories: ctx.categories,
    },
    ctx.mode === "production" ? "Minify" : "Do Not Minify",
  );

  await fs.writeFile(path.join(ctx.outputDirectory, "index.html"), html);
};

const renderPagination = async (chunks: BlogEntry[][], ctx: Context) => {
  for (let page = 0; page < chunks.length; page++) {
    const html = await renderTemplate<IndexParameter>(
      "webpage/index.njk",
      {
        heading: "ReadThis",
        title: "ReadThis",
        styles: ["index.css"],
        blogs: chunks[page],
        current: page + 1,
        total: chunks.length,
        categories: ctx.categories,
      },
      ctx.mode === "production" ? "Minify" : "Do Not Minify",
    );

    await fs.ensureDir(path.join(ctx.outputDirectory, (page + 1).toString()));
    await fs.writeFile(
      path.join(ctx.outputDirectory, (page + 1).toString(), "index.html"),
      html,
    );
  }
};

export const generateIndex = async (ctx: Context): Promise<void> => {
  const chunks = [...splitInChunks(ctx.entries, ctx.blogsPerPage)];
  await renderIndex(chunks, ctx);
  await renderPagination(chunks, ctx);
};
