import { parseFrontMatters } from "./parseFrontMatter.js";
import { createBlogEntry } from "./createBlogEntry.js";
import { BlogEntry } from "./BlogEntry.js";

/**
 * Iterates over all blog entries, parsing the front matter and rendering the
 * markdowns.
 *
 * @returns all blog entries
 */
export const parseBlogEntries = async (): Promise<BlogEntry[]> => {
  const frontMatters = await parseFrontMatters();
  const entries = await Promise.all(
    frontMatters.map<Promise<BlogEntry>>(createBlogEntry),
  );
  return entries;
};
