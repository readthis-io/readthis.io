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

Tasks can be composed using `gulp.series` and `gulp.parallel`.

```ts
import { series, parallel } from "gulp";

const composedTask = series(clean, build, parallel(watchJs, watchCss));
```

## File Streaming

### Source

`src(GLOB)` is using a glob to create a file stream. It is using the `micromatch` library.

> To find files not starting with underscore, use `[!_]`. E.g.
> `webpage/**/[^_]*.njk` to find all Nunjucks templates in the `webpage` folder,
> not starting with an `_`.

### Pipe

Pipes pipe each file trough the stream. Concatenate stream operators to
transform the file.

Custom stream operators can be added by using `trough2` as wrapper:

```ts
import trough from "through2";

const transformTemplate: trough.TransformFunction = (file, enc, cb) => {
  console.dir(file.contents);
  cb(null, file);
};

export const staticPages: TaskFunction = () => {
  return src("webpage/**/[^_]*.njk", { since: lastRun(staticPages) })
    .pipe(trough.obj(transformTemplate))
    .pipe(dest("dist/"));
};
```

On the `transform` function, file is the file streamed by gulp. You can modify
the files content, add meta data to the file object or change the file name.

Gulp uses `vinyl-fs` under the hood, so the file passes is a vinyl file:
[https://github.com/gulpjs/vinyl].

You can add customer properties to vinyl files and they will be passed with the
file. If the file is a buffer (in our cases, this is always true, but it could
be a readable stream), you can use `file.contents.toString(enc)` to convert the file content.

To convert the string back, construct a new Buffer.

```ts
const transformTemplate: trough.TransformFunction = (file, enc, cb) => {
  const str = file.contents.toString(enc);
  const buffer = Buffer.from(compiled, enc);

  // Important to modify the original file before passing it on.
  file.contents = buffer;
  cb(null, file);
};
```

After you have finished modifying the file, make sure to pass it on, by calling
the callback.
