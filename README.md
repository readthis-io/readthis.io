# readthis

> The main problem with gulp is, I did not find a way to create synthetic files
> E.g. the index.html is a source file, so it will be found by `src(***)`. But
> it will only show the first 10 entries, so if we have more then 10 entries,
> we need to create a new file, for the next entires. And here gulp fails.
>
> I think the best decision is to ditch gulp....

## Static Site Generator Redesign

> Build from Scratch, see reasons above.

Components required:

1. [Chokidar](https://github.com/paulmillr/chokidar) File watcher
1. [BrowserSync](https://www.npmjs.com/package/browser-sync) Hot Reloading +
   Dev Server
1. SASS + PostCSS + Tailwind + Plugins: For styling
1. Marked + Plugins: To convert Blog Posts
1. uglify-js: for minification
1. Gray-Matter: to extract front matter
1. Zod to parse front matter and enforce
1. Typescript to make coding bearable

## Getting Started

1. Clone the project `git clone git@github.com:readthis-io/blog.git`
1. Enter the directory `cd blog`
1. Select the local typescript version
1. Run `yarn build` to compile
1. Run `yarn watch` to start a local dev server with hot reloading.

If you update VSCode, ESLint or Prettier, run `yarn dlx @yarnpkg/sdks`.
