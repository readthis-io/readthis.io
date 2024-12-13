import { glob } from "glob";
import fs from "fs-extra";
import matter from "gray-matter";

import { FrontMatter, frontMatterScheme } from "./FrontMatter.js";

/**
 * Iterate over all blog files, parse the front matter and secure type safety
 * and type completeness.
 *
 * @returns All discovered front matters.
 */
export const parseFrontMatters = async (): Promise<FrontMatter[]> => {
  const paths = await glob("blog/**/*.md");
  const files = await Promise.all(
    paths.map(async (path) => ({
      path: path,
      content: await fs.readFile(path, "utf-8"),
    })),
  );

  const frontMatters = await Promise.all(
    files
      .map((file) => ({
        ...matter(file.content),
        path: file.path,
      }))
      .map((frontMatter) => frontMatterScheme.parseAsync(frontMatter)),
  );

  return frontMatters;
};
