import path from "path";

import { BlogEntry } from "./BlogEntry.js";
import { createSlug } from "./createSlug.js";
import { FrontMatter } from "./FrontMatter.js";
import { renderMarkdown } from "./renderMarkdown.js";

const extractFileName = (filename: string): string => {
  return path.basename(path.dirname(path.resolve(filename)));
};

/**
 * Reads a blogs front matter and creates a blog entry out of the front matter,
 * including the rendered markdown content.
 *
 * Enriches the frontmatter with generated contend.
 *
 * @param frontMatter the blogs front matter
 * @returns the blog entry
 */
export const createBlogEntry = async (
  frontMatter: FrontMatter,
): Promise<BlogEntry> => {
  return {
    descriptionMarkdown: frontMatter.data.description,
    description: await renderMarkdown(frontMatter.data.description),
    html: await renderMarkdown(frontMatter.content),
    markdown: frontMatter.content,
    slug: createSlug(frontMatter.data.slug, extractFileName(frontMatter.path)),
    tags: frontMatter.data.tags,
    title: frontMatter.data.title,
    featured_image: frontMatter.data.featured_image,
    topic: frontMatter.data.topic,
  };
};
