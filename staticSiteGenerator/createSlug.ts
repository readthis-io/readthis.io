import slugify from "slugify";

/**
 * Creates a URL friendly name, either from the provided slug or the file name.
 *
 * @param slug user provided slug, or undefined
 * @param name the file name
 * @returns the slug.
 */
export const createSlug = (slug: string | undefined, name: string): string => {
  if (slug) {
    return slugify.default(slug);
  }

  return slugify.default(name);
};
