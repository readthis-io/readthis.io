import fs from "fs-extra";

import { generateStyles } from "./generate/generateStyles.js";
import { parseBlogEntries } from "./parseBlogEntries.js";
import { generateBlogEntries } from "./generate/generateBlog.js";
import { generateIndex } from "./generate/generateIndex.js";
import { generateNotFound } from "./generate/generateNotFound.js";
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
import {
  makeGenerationContext,
  makeParsingContext,
  makePreparationContext,
  makeStyleGenerationContext,
} from "./makeContext.js";
import {
  GenerationContext,
  ParsingContext,
  PreparationContext,
} from "./Context.js";

/**
 * Generates the static website, parsing all source elements, including the
 * blog files. Will overwrite files without asking, but will not clean the target
 * directory.
 *
 * @param mode Apply production steps, like minification or not.
 */
export const build = async (mode: "production" | "debug") => {
  const parseCtx = await prepare(makePreparationContext(mode));
  const genCtx = await parse(parseCtx);
  await generate(genCtx);
};

const generate = async (ctx: GenerationContext) => {
  await ms("Writing Page Index", generateIndex, ctx);
  await ms("Writing Page Blog Entries", generateBlogEntries, ctx);
  await ms("Writing Page Not Found", generateNotFound, ctx);
  await ms("Writing Page Categories", generateCategories, ctx);
  await ms("Writing Page Imprint", generateImprint, ctx);
  await ms("Writing Page About Us", generateAboutUs, ctx);
  await ms("Writing Page Contact", generateContact, ctx);
  await ms("Writing Page Privacy", generatePrivacy, ctx);
  await ms("Writing FavIcon", generateFavIcon, ctx);
  await ms("Writing Manifest", generateManifest, ctx);
};

const prepare = async (ctx: PreparationContext) => {
  await fs.ensureDir(ctx.outputDirectory);

  const fonts = await ms("Generate Fonts", generateFonts, ctx);
  const images = await ms("Generate Images", generateImages, ctx);

  const styleCtx = makeStyleGenerationContext(ctx, fonts, images);
  const styles = await ms("Generate Styles", generateStyles, styleCtx);

  return makeParsingContext(styleCtx, styles);
};

const parse = async (ctx: ParsingContext): Promise<GenerationContext> => {
  const entries = await ms("Parse Entries", parseBlogEntries, ctx);
  return makeGenerationContext(ctx, entries);
};
