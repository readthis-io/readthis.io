import { BlogEntry } from "./BlogEntry.js";

export interface Context {
  mode: "production" | "debug";
  outputDirectory: string;
  entries: BlogEntry[];
  blogsPerPage: number;
}
