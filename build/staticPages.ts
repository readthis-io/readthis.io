import gulp, { src, dest, TaskFunction, lastRun } from "gulp";
import htmlMin from "gulp-htmlmin";
import trough from "through2";
import rename from "gulp-rename";
import nun from "nunjucks";

const transformTemplate: trough.TransformFunction = (file, enc, cb) => {
  const str = file.contents.toString(enc);
  const data = file.data ?? {};

  const nunEnv = new nun.Environment(new nun.FileSystemLoader(file.base));
  const compiled = nunEnv.renderString(str, data);

  file.contents = Buffer.from(compiled, enc);
  cb(null, file);
};

export const staticPages: TaskFunction = () => {
  return src("webpage/**/[^_]*.njk", { since: lastRun(staticPages) })
    .pipe(trough.obj(transformTemplate))
    .pipe(
      htmlMin({
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        useShortDoctype: false,
        sortClassName: true,
        sortAttributes: true,
        removeTagWhitespace: true,
        removeStyleLinkTypeAttributes: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeOptionalTags: false,
        removeEmptyElements: false,
        removeEmptyAttributes: false,
        removeComments: true,
        removeAttributeQuotes: false,
        processConditionalComments: false,
        preserveLineBreaks: false,
        minifyJS: true,
        minifyURLs: true,
        minifyCSS: true,
        keepClosingSlash: true,
        includeAutoGeneratedTags: true,
        html5: true,
      })
    )
    .pipe(
      rename((path) => ({
        dirname: path.basename === "index" ? "." : path.basename,
        basename: "index",
        extname: ".html",
      }))
    )
    .pipe(dest("dist/"));
};

export const watchStaticPages = () => {
  gulp.watch("webpage/**/*.njk", staticPages);
};
