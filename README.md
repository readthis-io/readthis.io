# ReadThis

Tech-Blog about everything we find interesting. Build using Gulp to generate a
fully static website.

Todo:

- [x] Dev Server (with Hot Reloading) - env for port is missing.
- [x] Getting Started Documentation
- [x] Process Static HTML (404, Imprint, About)
- [x] Process Styles (SCSS, PostCSS, Tailwind)
- [x] Templating System (I would like to test Nunjucks)
- [ ] Create Static Pages
  - [ ] Create Frame
  - [ ] 404
  - [ ] Index
  - [ ] Categories
- [ ] Create Blog Entries
  - [ ] Add Read time indicator
- [ ] Collect Meta Information about Blog Posts
  - [ ] Construct list of categories (to be included in page frame)
  - [ ] Create Start Page with list of last created blogs
  - [ ] Add Search to Page
- [ ] Automatically host web page
- [ ] Add Cookie Banner and Enable Google Analytics
- [ ] Fix HMR for Styles
- [ ] Make static resources immutable by using the file hash as name.

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
