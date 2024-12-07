import gulp, { TaskFunction } from "gulp";
import sync from "browser-sync";

const server = sync.create();

export const serve: TaskFunction = () => {
  server.init({
    server: {
      baseDir: "./dist/",
    },
  });

  return gulp.watch("./dist/*").on("change", server.reload);
};
