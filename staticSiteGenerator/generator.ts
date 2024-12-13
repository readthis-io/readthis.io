import fs from "fs-extra";

import { generateStyles } from "./generateStyles.js";
import { parseBlogEntries } from "./parseBlogEntries.js";
import { generateBlogEntries } from "./generateBlog.js";
import { generateIndex } from "./generateIndex.js";
import { generateNotFound } from "./generateNotFound.js";
import { makeContext } from "./generateContext.js";

/**
 * Generates the static website, parsing all source elements, including the
 * blog files. Will overwrite files without asking, but will not clean the target
 * directory.
 *
 * @param mode Apply production steps, like minification or not.
 */
export const build = async (mode: "production" | "debug") => {
  const entries = await parseBlogEntries();
  const ctx = makeContext(mode, entries);

  await fs.ensureDir(ctx.outputDirectory);

  // TODO: this method should return the mapped filenames, so we can use the
  // content hashed based name, instead of the real one.
  await generateStyles(ctx);
  await generateBlogEntries(ctx);
  await generateIndex(ctx);
  await generateNotFound(ctx);
};
