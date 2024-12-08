import gulp, { src, dest, TaskFunction, lastRun } from "gulp";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import tailwind from "tailwindcss";
//@ts-expect-error there are no typings for this library.
import sass from "@csstools/postcss-sass";

import { browserSyncInstance } from "./serve";

export const styles: TaskFunction = () => {
  return (
    src("webpage/**/[^_]*.scss", { since: lastRun(styles) })
      .pipe(postcss([sass(), tailwind(), autoprefixer(), cssnano()]))
      .pipe(
        rename({
          extname: ".css",
        })
      )
      .pipe(dest("dist/"))
      // .pipe(
      //   rename((path) => {
      //     console.log(path.dirname);
      //     return {
      //       dirname: path.dirname.substring(5),
      //       basename: path.basename,
      //       extname: path.extname,
      //     };
      //   })
      // )
      .pipe(browserSyncInstance.stream())
  );
};

export const watchStyles = () => {
  return gulp.watch("webpage/**/*.scss", styles);
};
