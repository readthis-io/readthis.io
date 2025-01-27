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
import { generateFavIcon } from "./generate/generateFavIcon.js";
import { generateManifest } from "./generate/generateManifest.js";
import { ms } from "./helper/ms.js";

/**
 * Generates the static website, parsing all source elements, including the
 * blog files. Will overwrite files without asking, but will not clean the target
 * directory.
 *
 * @param mode Apply production steps, like minification or not.
 */
export const build = async (mode: "production" | "debug") => {
  const entries = await ms("Parse Entries", parseBlogEntries);
  const ctx = makeContext(mode, entries);

  await fs.ensureDir(ctx.outputDirectory);

  ctx.staticFonts = await ms("Generate Fonts", generateFonts, ctx);
  ctx.staticImages = await ms("Generate Images", generateImages, ctx);
  ctx.staticStyles = await ms("Generate Styles", generateStyles, ctx);

  await ms("Writing Page Blog Entries", generateBlogEntries, ctx);
  await ms("Writing Page Index", generateIndex, ctx);
  await ms("Writing Page Not Found", generateNotFound, ctx);
  await ms("Writing Page Categories", generateCategories, ctx);
  await ms("Writing Page Imprint", generateImprint, ctx);
  await ms("Writing Page About Us", generateAboutUs, ctx);
  await ms("Writing Page Contact", generateContact, ctx);
  await ms("Writing Page Privacy", generatePrivacy, ctx);
  await ms("Writing FavIcon", generateFavIcon, ctx);
  await ms("Writing Manifest", generateManifest, ctx);
};
