import gulp, { src, dest, TaskFunction } from "gulp";

export const staticPages: TaskFunction = () => {
  return src("webpage/*.html").pipe(dest("dist/"));
};

export const watchStaticPages = () => {
  gulp.watch("webpage/*.html", staticPages);
};
