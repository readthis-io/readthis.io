import { parallel, series, task } from "gulp";

import { clean } from "./build/clean";
import { staticPages, watchStaticPages } from "./build/staticPages";
import { serve } from "./build/serve";

const taskBuild = series(clean, staticPages);
const taskWatch = series(taskBuild, parallel(serve, watchStaticPages));

task("build", taskBuild);
task("watch", taskWatch);
