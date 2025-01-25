import fs from "fs-extra";

import { generateStyles } from "./generate/generateStyles.js";
import { parseBlogEntries } from "./parseBlogEntries.js";
import { generateBlogEntries } from "./generate/generateBlog.js";
import { generateIndex } from "./generate/generateIndex.js";
import { generateNotFound } from "./generate/generateNotFound.js";
import { makeContext } from "./makeContext.js";
import { generateCategories } from "./generate/generateCategories.js";
import { generateImprint } from "./generate/generateImprint.js";
import { generateAboutUs } from "./generate/generateAboutUs.js";
import { generateFonts } from "./generate/generateFonts.js";
import { generateImages } from "./generate/generateImages.js";
import { generateContact } from "./generate/generateContact.js";
import { generatePrivacy } from "./generate/generatePrivacy.js";

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
  await generateFonts(ctx);
  await generateImages(ctx);
  ctx.staticStyles = await generateStyles(ctx);
  await generateBlogEntries(ctx);
  await generateIndex(ctx);
  await generateNotFound(ctx);
  await generateCategories(ctx);
  await generateImprint(ctx);
  await generateAboutUs(ctx);
  await generateContact(ctx);
  await generatePrivacy(ctx);
  await generateStyles(ctx);
};
