# Content Authoring Guide

This site generates static HTML from Markdown files using `node build.js`.

## Quick start

```bash
node build.js
```

That's it. The script reads every `.md` file in `content/` and writes HTML pages into `blog/`, `works/`, and `gallery/`.

---

## Adding a new post

### 1. Create the Markdown file

Drop a `.md` file into the right folder:

| Content type | Folder |
|---|---|
| Blog post | `content/blog/` |
| Work / project | `content/works/` |
| Gallery item | `content/gallery/` |

The filename becomes the URL slug. `content/blog/my-post-title.md` → `/blog/my-post-title/`

> **Slug rules:** lowercase, hyphens only, no spaces. Example: `building-a-search-ui.md`

### 2. Write the frontmatter

Every file must start with a YAML block between `---` delimiters:

```markdown
---
title: "My Post Title"
date: "2024-06-20"
tags: ["tag1", "tag2"]
excerpt: "A one-sentence description shown on the listing page."
type: blog
---

Your content starts here...
```

**Frontmatter fields:**

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Shown as the `<h1>` and in the listing |
| `date` | Recommended | ISO 8601 format: `YYYY-MM-DD`. Used for sorting (newest first). |
| `tags` | Optional | Array of strings: `["web", "design"]` |
| `excerpt` | Optional | Shown on the listing page as a summary |
| `type` | Optional | `blog`, `work`, or `gallery` — informational only |
| `slug` | Optional | Override the auto-generated slug from the filename |

### 3. Run the build

```bash
node build.js
```

You'll see output like:

```
  ✓  blog/my-post-title/index.html
  ✓  blog/index.html

Done — 2 files written.
```

### 4. Commit and push

```bash
git add blog/ works/ gallery/ content/
git commit -m "add: my post title"
git push
```

GitHub Pages will serve the new page at `https://abahziz0.github.io/blog/my-post-title/` within a minute or two.

---

## Markdown features

Standard CommonMark is supported via the `marked` library. This includes:

- **Headings** — `# H1`, `## H2`, `### H3`
- **Bold / italic** — `**bold**`, `*italic*`
- **Links** — `[text](url)`
- **Images** — `![alt](url)` (hosted externally or in the repo)
- **Code** — inline `` `code` `` and fenced ` ``` ` blocks
- **Blockquotes** — `> quote`
- **Tables** — standard pipe syntax
- **Horizontal rules** — `---`
- **Lists** — ordered and unordered

---

## Editing the design

All styles live inside `build.js` in the `CSS` string at the top of the file. The design tokens are:

```css
--bg: #F5EEE6;      /* page background (warm beige) */
--nav-bg: #E5D4C5;  /* nav bar background */
--text: #3D1C08;    /* primary text (dark brown) */
--dim: #8A6040;     /* muted text */
--accent: #8B3A0A;  /* links, tags, hover states */
--orange: #F97316;  /* logo, blockquote accent */
--border: #D8CCBC;  /* borders and separators */
--card: #EDE4D8;    /* card and code block backgrounds */
```

These match the variables used in `index.html`, keeping the design system consistent.

---

## Listing pages

Each section has a listing page that is regenerated automatically:

| URL | File |
|---|---|
| `/blog/` | `blog/index.html` |
| `/works/` | `works/index.html` |
| `/gallery/` | `gallery/index.html` |

Posts appear in reverse chronological order (newest first). The listing shows title, date, tags, and excerpt.

---

## Changing the listing descriptions

Edit the `LISTING_META` object near the top of `build.js`:

```js
const LISTING_META = {
  blog:    { title: 'Blog',    desc: 'Writing on code, design, and ideas.' },
  works:   { title: 'Works',   desc: 'Projects and things I\'ve built.'    },
  gallery: { title: 'Gallery', desc: 'Photos, sketches, and visual work.'  },
};
```

---

## File structure reference

```
.
├── build.js                 ← build script (run this)
├── README-CONTENT.md        ← this file
│
├── content/                 ← source Markdown (edit these)
│   ├── blog/
│   │   └── hello-world.md
│   ├── works/
│   │   └── portfolio-site.md
│   └── gallery/
│       └── street-photos.md
│
├── blog/                    ← generated (do not edit by hand)
│   ├── index.html
│   └── hello-world/
│       └── index.html
├── works/                   ← generated
│   ├── index.html
│   └── portfolio-site/
│       └── index.html
└── gallery/                 ← generated
    ├── index.html
    └── street-photos/
        └── index.html
```

---

## Dependencies

Only one: [`marked`](https://marked.js.org/) for Markdown parsing. It's already installed.

If you clone the repo fresh:

```bash
npm install
```

Then build:

```bash
node build.js
```
