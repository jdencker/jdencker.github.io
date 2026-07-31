# jdencker.github.io

Static source for the personal portfolio published at:

- `https://jdencker.github.io/`
- `/node-hub/` for the independently deployed Node Hub project site
- `/resume/` for the independently deployed, versioned résumé

This repository intentionally uses plain HTML, CSS, and a small amount of
browser-native JavaScript. It has no framework, package manager, or build
step — what is committed is what is served.

## Site architecture

GitHub Pages composes the public site from three repositories:

| Public route | Owning repository | Deployment |
| --- | --- | --- |
| `/` | `jdencker/jdencker.github.io` | Publish `main` from the repository root |
| `/node-hub/` | `jdencker/node-hub` | Build and deploy its static artifact with GitHub Actions |
| `/resume/` | `jdencker/resume` | Build and deploy its static artifact with GitHub Actions |

Do not copy the Node Hub or résumé artifacts into this repository. Link to
them by URL; the portfolio links to `/node-hub/` and `/resume/`.

## Design notes

The page implements the approved design handoff exactly:

- **Light mode only**, by decision. Tokens are CSS custom properties on
  `:root` in `assets/css/styles.css`, so a future dark block is cheap — but do
  not add one now.
- **Minimal JavaScript.** Browser-native ES modules load public repository
  metadata from the GitHub REST API. The committed repository rows remain as
  a fallback if the API is unavailable or rate-limited.
- No rounded corners, no shadows, no images. Icons are three hand-inlined
  SVGs (GitHub mark, LinkedIn mark, map pin).
- Fonts are Newsreader (display), Space Grotesk (body), and JetBrains Mono
  (metadata), loaded from Google Fonts.
- Selected Work is intentionally limited to Node Hub and Résumé as Code.
  Their case-study routes are minimal, unindexed stubs until the long-form
  narratives are ready. Each card presents the case study as its high-contrast
  primary button, with quieter product and codebase links alongside it.

## File-by-file instructions

### `index.html`

The complete portfolio page: sticky header, hero, Selected Work, Approach,
Experience (with Advisory & Consulting), Education, Open Source, and the
contact footer. All copy is final approved copy from the design handoff.

Keep semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`),
accessible labels, and meaningful link text.

### `404.html`

The fallback shown when a GitHub Pages route does not exist. Lightweight,
reuses the site stylesheet, and always provides a clear link back to `/`.

GitHub Pages does not provide arbitrary SPA rewrites. Interactive project
sites should use a single route, hash routing, or their own `404.html`
strategy.

### `case-studies/`

Contains one directory per curated case study. Each route uses an
`index.html` so it resolves with a clean trailing-slash URL. New stubs should
include `noindex` until substantive content is published, then add canonical
metadata and a sitemap entry.

### `.nojekyll`

Tells GitHub Pages to publish the files directly without processing them as a
Jekyll site. Keep this file at the repository root.

### `.gitignore`

Lists local operating-system and editor files that should not be committed.
Add entries only for generated local files; do not ignore files required by
the published site.

### `robots.txt`

Controls search-engine crawling. It allows the complete public site to be
indexed and points crawlers to `sitemap.xml`. Update the sitemap URL if a
custom domain replaces `jdencker.github.io`.

### `sitemap.xml`

Lists canonical pages owned by this repository. Add stable portfolio pages if
the site becomes multi-page. The independently deployed `/node-hub/` and
`/resume/` sites may maintain their own sitemap entries.

Update every `<loc>` value when switching to a custom domain.

### `assets/css/styles.css`

The single stylesheet for the portfolio. Design tokens sit at the top as CSS
custom properties, then rules are organized by page section, with responsive
breakpoints (1120px, 1000px, 820px, 760px) and `:focus-visible` and
reduced-motion treatment at the end.

Do not place Node Hub styles here; its deployed artifact owns its CSS.

### `assets/images/`

Portfolio-owned image assets. Currently only `favicon.svg`. Prefer
appropriately sized WebP, AVIF, or optimized PNG/JPEG files for any future
images, with descriptive lowercase filenames and meaningful `alt` text in the
HTML.

### `assets/js/case-studies.js`

Defines the explicit relationship between curated case studies and their
supporting repositories. A case study can reference several repositories;
GitHub topics remain descriptive metadata rather than relational keys.

This file is the single source of truth for case-study membership. The Open
Source directory derives its case-study badges from this mapping for both API
results and committed fallback rows; do not hard-code those badges in HTML.

Update this file when a repository becomes part of a different body of work.
Keep long-form case-study narrative in the corresponding HTML page.

### `assets/js/repositories.js`

Fetches every public repository for `jdencker` from the unauthenticated GitHub
REST API and renders the Open Source directory. Repository names,
descriptions, homepages, topics, language, fork state, and archive state come
from GitHub. Case-study badges come from `case-studies.js`.

Never place a GitHub token in browser JavaScript. If the request fails, the
script leaves the committed fallback rows in `index.html` intact.

## Linked repository requirements

### Node Hub

The `node-hub` repository should:

- build with `/node-hub/` as its public base path;
- upload the contents of its static output directory as a Pages artifact;
- deploy that artifact with GitHub Actions;
- avoid server-only dependencies and history routes that require rewrites.

### Résumé

The `resume` repository should publish a landing page at `/resume/` and its
versioned PDF at `/resume/resume.pdf`. The portfolio links to the stable
landing page from the header button and the Experience section.

## Local preview

From the repository root:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

Test project links against their deployed URLs, or run those project builds
under matching local paths when validating the complete URL structure.

## Publishing the portfolio

In the GitHub repository, open **Settings → Pages** and choose:

- Source: **Deploy from a branch**
- Branch: `main`
- Folder: `/ (root)`

Every push to `main` will republish the portfolio.

If a custom domain is added later, configure it on the primary
`jdencker.github.io` Pages site. Leave the project repositories without
separate custom domains unless they intentionally need their own subdomains.

## Pre-publish checklist

- Confirm `/node-hub/` and `/resume/` resolve correctly.
- Confirm the Open Source directory loads from GitHub and that the committed
  fallback remains readable with JavaScript disabled.
- Confirm there are no missing stylesheets or icons.
- Test keyboard navigation and visible focus states.
- Test narrow and wide layouts (breakpoints: 1120, 1000, 820, 760).
- Update `sitemap.xml`, `robots.txt`, and canonical metadata for the final
  domain.
- Inspect the browser console and network panel for errors.
- Commit and push only after the local preview passes.
