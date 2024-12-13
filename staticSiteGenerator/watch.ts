import chokidar from "chokidar";
import browserSync from "browser-sync";

import { build } from "./generator.js";
import { parseBlogEntries } from "./parseBlogEntries.js";
import { makeContext } from "./generateContext.js";

export const watch = async (mode: "production" | "debug") => {
  const entries = await parseBlogEntries();
  const ctx = makeContext(mode, entries);

  browserSync({ server: ctx.outputDirectory });

  chokidar.watch(["blog/", "webpage/"]).on("all", async (event, path) => {
    console.log("Detected Change: ", event, path);
    await build(mode);
    browserSync.reload();
  });
};
