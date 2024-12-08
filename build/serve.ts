import gulp, { TaskFunction } from "gulp";
import sync from "browser-sync";

export const browserSyncInstance = sync.create();

export const serve: TaskFunction = () => {
  browserSyncInstance.init({
    server: {
      baseDir: "./dist/",
    },
  });

  return gulp.watch("./dist/**/*").on("change", browserSyncInstance.reload);
};
