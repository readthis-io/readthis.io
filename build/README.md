# Gulp Notes

## Tasks

A gulp task is a asynchronous function. A task can be completed in multiple
ways:

- returning a `stream`
- returning a `Promise`
- returning an `EventEmitter`
- returning a `child_process`
- returning an `Observable` (RxJS, I don't think we will use this)
- Or, if the method returns nothing, a callback passed down as parameter.

Here are some examples:

```ts
const task: TaskFunction = async () => {
  await fs.readFile("myFile.txt");
};

const task: TaskFunction = async () => {
  return src("webpage/*.html").pipe(dest("dist/"));
};

const task: TaskFunction = async (cb) => {
  // Do something
  cb();

  // OR to fails
  cb(new Error("Task failed"));
};
```

## Composing

Tasks can be composed using `gulp.series` and `gulp.parallel`

```ts
import { series, parallel } from "gulp";

const composedTask = series(clean, build, parallel(watchJs, watchCss));
```

## File Streaming

To be done
