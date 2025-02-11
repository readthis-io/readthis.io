import path from "path";
import fs from "fs-extra";

import { renderTemplate } from "../renderTemplate.js";
import { BlogEntry } from "../BlogEntry.js";
import { GenerationContext } from "../Context.js";

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

const renderIndex = async (chunks: BlogEntry[][], ctx: GenerationContext) => {
  const html = await renderTemplate<IndexParameter>(
    "webpage/index.njk",
    {
      heading: "ReadThis",
      title: "ReadThis",
      styles: ["index"],
      blogs: chunks[0].map((x) => ({
        ...x,
        featuredImage: x.featuredImage
          ? ctx.staticImages[x.featuredImage]
          : ctx.staticImages[ctx.defaultFeatureImageKey],
      })),
      current: 1,
      total: chunks.length,
      slug: "/",
    },
    ctx,
  );

  await fs.writeFile(path.join(ctx.outputDirectory, "index.html"), html);
};

const renderPagination = async (
  chunks: BlogEntry[][],
  ctx: GenerationContext,
) => {
  for (let page = 0; page < chunks.length; page++) {
    const html = await renderTemplate<IndexParameter>(
      "webpage/index.njk",
      {
        heading: "ReadThis",
        title: "ReadThis",
        styles: ["index"],
        blogs: chunks[page].map((x) => ({
          ...x,
          featuredImage: x.featuredImage
            ? ctx.staticImages[x.featuredImage]
            : ctx.staticImages[ctx.defaultFeatureImageKey],
        })),
        current: page + 1,
        total: chunks.length,
        slug: `/${page}`,
      },
      ctx,
    );

    await fs.ensureDir(path.join(ctx.outputDirectory, (page + 1).toString()));
    await fs.writeFile(
      path.join(ctx.outputDirectory, (page + 1).toString(), "index.html"),
      html,
    );
  }
};

export const generateIndex = async (ctx: GenerationContext): Promise<void> => {
  const chunks = [...splitInChunks(ctx.entries, ctx.blogsPerPage)];
  await renderIndex(chunks, ctx);
  await renderPagination(chunks, ctx);
};
