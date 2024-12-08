import { parallel, series, task } from "gulp";

import { clean } from "./build/clean";
import { staticPages, watchStaticPages } from "./build/staticPages";
import { serve } from "./build/serve";
import { styles, watchStyles } from "./build/styles";

const taskBuild = series(clean, styles, staticPages);
const taskWatch = series(
  taskBuild,
  parallel(serve, watchStyles, watchStaticPages)
);

task("build", taskBuild);
task("watch", taskWatch);
