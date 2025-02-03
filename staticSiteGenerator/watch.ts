import chokidar from "chokidar";
import browserSync from "browser-sync";

import { build } from "./generator.js";
import { ms } from "./helper/ms.js";
import { makePreparationContext } from "./makeContext.js";

export const watch = async (mode: "production" | "debug") => {
  const ctx = makePreparationContext(mode);

  browserSync({ server: ctx.outputDirectory });

  chokidar
    .watch(["./blog", "./webpage"], {
      atomic: true,
      awaitWriteFinish: true,
      ignoreInitial: true,
      interval: 100,
    })
    .on("all", async (event, path) => {
      console.log("Detected Change: ", event, path);

      try {
        await ms("Rebuild", build, mode);
        browserSync.reload();
      } catch (e) {
        console.log("Compilation failed", e);
      }
    });
};
