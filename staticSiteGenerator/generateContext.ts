import path from "path";

import { BlogEntry } from "./BlogEntry.js";
import { Context } from "./Context.js";

export const makeContext = (
  mode: "production" | "debug",
  entries: BlogEntry[],
): Context => {
  return {
    mode: mode,
    entries: entries,
    outputDirectory: path.join("dist", "webpage"),
    blogsPerPage: 6,
  };
};
