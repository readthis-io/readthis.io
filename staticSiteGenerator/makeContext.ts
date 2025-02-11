import path from "path";
import slugify from "slugify";

import { BlogEntry } from "./BlogEntry.js";
import {
  PreparationContext,
  Styles,
  Fonts,
  Images,
  ParsingContext,
  GenerationContext,
  Category,
  StyleGenerationContext,
  Scripts,
} from "./Context.js";

export const makePreparationContext = (
  mode: "debug" | "production",
): PreparationContext => {
  return {
    generationTime: new Date().toISOString(),
    year: new Date().getFullYear().toString(),
    defaultFeatureImageKey: "defaultFeatureImage.webp",
    blogsPerPage: 6,
    outputDirectory: path.join("dist", "webpage"),
    mode: mode,
  };
};

export const makeStyleGenerationContext = (
  ctx: PreparationContext,
  staticFonts: Fonts,
  staticImages: Images,
  staticScripts: Scripts,
): StyleGenerationContext => {
  return {
    ...ctx,
    staticFonts: staticFonts,
    staticImages: staticImages,
    staticScripts: staticScripts,
  };
};

export const makeParsingContext = (
  ctx: StyleGenerationContext,
  staticStyles: Styles,
): ParsingContext => {
  return {
    ...ctx,
    staticStyles: staticStyles,
  };
};

export const makeGenerationContext = (
  ctx: ParsingContext,
  entries: BlogEntry[],
): GenerationContext => {
  return {
    ...ctx,
    entries: entries,
    categories: extractCategories(entries),
  };
};

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
