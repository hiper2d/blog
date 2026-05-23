# Alex Zelenovsky's blog

Astro static site. Posts in `posts/`, built to `dist/`, deployed to Cloudflare Pages.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
```

Drafts (`status: draft` in frontmatter) render in dev mode only.

## Build

```bash
npm run build    # static output → dist/
```

## Writing a post

Drop a markdown file into `posts/`. Frontmatter shape:

```yaml
---
title: "Post title"
slug: "url-slug-optional"          # falls back to filename
date: 2026-05-23
status: published                  # or draft
summary: "Short blurb for listings and meta description"
tags: [security, ai]
header_image: /images/foo.png      # optional
canonical_url: https://...         # optional — sets <link rel="canonical">
---

Markdown body. Shiki renders fenced code blocks with light/dark themes.
```

## Structure

```
posts/                  ← markdown content
src/
  components/           ← Astro components
  layouts/Base.astro    ← site shell
  lib/posts.ts          ← post loading + sorting helpers
  pages/
    index.astro         ← home (recent posts)
    archive.astro       ← all posts by year
    about.astro         ← about page
    post/[slug].astro   ← post detail
    rss.xml.ts          ← RSS feed
  styles/global.css     ← all styling, CSS variables for theme
  content.config.ts     ← content collection schema
public/                 ← static assets (favicon, etc.)
astro.config.mjs        ← Astro config (site URL, Shiki themes)
```

## Deployment

Cloudflare Pages. Build command: `npm run build`. Output: `dist`.

## Cross-posting

Canonical version of any post lives here. When syndicating to Substack,
LinkedIn, etc., set their canonical tag back to the URL on this blog
(Substack supports this via the "Original URL" field in post settings;
LinkedIn does not, which is why LinkedIn copies should be shorter teasers
linking back rather than full duplicates).

## Edited by

[Simona](https://github.com/hiper2d/simona-ai-computer-operator) — AI pair partner
maintained by Alex. She drafts, reviews, and occasionally adds inline asides
in italics.
