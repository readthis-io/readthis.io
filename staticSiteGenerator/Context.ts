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

export interface Images {
  [name: string]: string;
}

export interface PreparationContext {
  mode: "debug" | "production";
  generationTime: string;
  year: string;
  defaultFeatureImageKey: string;
  blogsPerPage: number;
  outputDirectory: string;
}

export interface StyleGenerationContext extends PreparationContext {
  staticFonts: Fonts;
  staticImages: Images;
}

export interface ParsingContext extends StyleGenerationContext {
  staticStyles: Styles;
}

export interface GenerationContext extends ParsingContext {
  categories: Category[];
  entries: BlogEntry[];
}
