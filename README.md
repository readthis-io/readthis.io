# ReadThis

Tech-Blog about everything we find interesting. Build using Gulp to generate a
fully static website.

Todo:

- [x] Dev Server (with Hot Reloading) - env for port is missing.
- [ ] Getting Started Documentation
- [ ] Process Static HTML (404, Imprint, About)
- [ ] Process Styles (SCSS, PostCSS, Tailwind)
- [ ] Templating System (I would like to test Nunjucks)
- [ ] Create Static Pages
  - [ ] Create Frame
  - [ ] 404
  - [ ] Index
  - [ ] Categories
- [ ] Create Blog Entries

# Getting Started

1. Clone the project `git clone git@github.com:readthis-io/blog.git`
1. Enter the directory `cd blog`
1. Select the local typescript version
1. Run `yarn build` to compile
1. Run `yarn watch` to start a local dev server with hot reloading.

If you update VSCode, ESLint or Prettier, run `yarn dlx @yarnpkg/sdks`.

# Structure

- `blog`: Contains the the blog posts, one folder per entry with one markdown
  file and any static resources like images.
- `build`: Contains the build scripts to build the web page.
- `webpage`: Contains static and reusable parts, like the 404 and footer/header
  components.
