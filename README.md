# jdencker.github.io

Source for [jdencker.github.io](https://jdencker.github.io/), my personal portfolio and public project index.

The site uses plain HTML, CSS, and browser-native JavaScript.

## Quick start

1. Edit the relevant HTML, CSS, or JavaScript files.
2. Preview locally with `python3 -m http.server 8080`.
3. Open [http://localhost:8080](http://localhost:8080) and perform a final visual and interaction check.
4. Commit the changes on a feature branch and push it to GitHub.
5. Wait for CI to pass, then merge into `main`; GitHub Pages publishes the updated site automatically.

## Site architecture

GitHub Pages combines three independently maintained repositories under the same public domain:

| Public route | Repository | Publishing method |
| --- | --- | --- |
| `/` | `jdencker/jdencker.github.io` | `main`, repository root |
| `/node-hub/` | `jdencker/node-hub` | Static artifact deployed by GitHub Actions |
| `/resume/` | `jdencker/resume` | Static artifact deployed by GitHub Actions |

The Node Hub and résumé artifacts do not belong in this repository. The portfolio links to their published URLs.

## Project structure

```text
.
├── index.html                   # Main portfolio page
├── 404.html                     # Not-found page
├── .github/workflows/ci.yml     # Automated site quality gate
├── .editorconfig                # Shared editor formatting defaults
├── .htmlvalidate.json           # HTML validation rules used by CI
├── case-studies/                # One clean URL per case study
│   ├── node-hub/index.html
│   └── resume-as-code/index.html
├── assets/
│   ├── css/
│   │   ├── styles.css           # Site styles and design tokens
│   │   └── case-study.css       # Node Hub case-study layout
│   ├── fonts/                    # Self-hosted WOFF2 fonts and licenses
│   ├── images/
│   │   ├── README.md             # Image sources and trademark notes
│   │   ├── favicon.svg
│   │   ├── logo-*.svg           # Architecture technology marks
│   │   ├── node-hub-dashboard.png
│   │   └── portfolio-preview.png # Homepage social-sharing image
│   └── js/
│       ├── case-studies.js      # Case-study-to-repository mapping
│       ├── repositories.js      # GitHub repository directory
│       └── scrollspy.js         # Active-section navigation tracking
├── robots.txt
├── sitemap.xml
└── .nojekyll                    # Disables Jekyll processing
```

## Repository directory

`assets/js/repositories.js` fetches all public repositories owned by `jdencker` from the unauthenticated GitHub REST API. Names, descriptions, topics, languages, links, and repository state come from GitHub.

The **Featured** view contains repositories referenced by `assets/js/case-studies.js`, in mapping order. The **All repositories** view contains every public repository ordered by its most recent push. If the API is unavailable—or JavaScript is disabled—the page links directly to the GitHub profile instead of maintaining duplicate repository metadata.

## Case studies

`assets/js/case-studies.js` is the single source of truth connecting case studies to repositories. A case study may reference more than one repository, and the repository directory derives its case-study badges from this mapping.

Each case study lives at `case-studies/<slug>/index.html`. Keep unfinished stubs marked `noindex`. When a case study is ready, remove that directive and add the page to `sitemap.xml`.

## Local development

From the repository root, run:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

Because Node Hub and the résumé are separate deployments, their links point to the live GitHub Pages URLs during local development.

## Publishing

Configure this repository under **Settings → Pages** with:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`

Every push to `main` republishes the portfolio. Pull requests and pushes to `main` run CI first.

CI validates HTML, JavaScript syntax, referenced assets, and links. Before merging, manually check the responsive layout, keyboard navigation, browser console, and the GitHub-profile fallback with JavaScript disabled.
