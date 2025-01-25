import { BlogEntry } from "./BlogEntry.js";

export interface Category {
  slug: string;
  category: string;
  entries: BlogEntry[];
  count: number;
}

export interface Styles {
  [name: string]: string;
}

export interface Fonts {
  [name: string]: string;
}

export interface Context {
  mode: "production" | "debug";
  outputDirectory: string;
  entries: BlogEntry[];
  blogsPerPage: number;
  categories: Category[];
  staticStyles: Styles;
  staticFonts: Fonts;
  generationTime: string;
  year: string;
}
