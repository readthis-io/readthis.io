import path from "path";
import slugify from "slugify";

import { BlogEntry } from "./BlogEntry.js";
import { Category, Context } from "./Context.js";

const extractCategories = (entries: BlogEntry[]): Category[] => {
  const categories: {
    [category: string]: Category;
  } = {};

  for (const entry of entries) {
    if (!categories[entry.topic]) {
      categories[entry.topic] = {
        slug: slugify.default(entry.topic),
        category: entry.topic,
        count: 1,
        entries: [entry],
      };
    } else {
      categories[entry.topic].entries.push(entry);
      categories[entry.topic].count = categories[entry.topic].entries.length;
    }
  }

  return Object.values(categories).sort((a, b) => a.count - b.count);
};

export const makeContext = (
  mode: "production" | "debug",
  entries: BlogEntry[],
): Context => {
  return {
    mode: mode,
    entries: entries,
    outputDirectory: path.join("dist", "webpage"),
    blogsPerPage: 6,
    categories: extractCategories(entries),
    staticStyles: {},
    staticFonts: {},
    generationTime: new Date().toISOString(),
    year: new Date().getFullYear().toString(),
  };
};
