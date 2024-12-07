import { TaskFunction } from "gulp";
import fs from "fs-extra";

export const clean: TaskFunction = () => {
  return fs.rm("dist/", { force: true, recursive: true });
};
