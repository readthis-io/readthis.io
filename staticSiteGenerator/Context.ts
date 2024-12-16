import { BlogEntry } from "./BlogEntry.js";

export interface Category {
  slug: string;
  category: string;
  entries: BlogEntry[];
  count: number;
}

export interface Context {
  mode: "production" | "debug";
  outputDirectory: string;
  entries: BlogEntry[];
  blogsPerPage: number;
  categories: Category[];
}
