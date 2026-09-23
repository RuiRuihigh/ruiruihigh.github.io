# Mingrui Liang — Personal website

Personal academic website based on [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) by Mark Horn (MIT). The original license is retained in `LICENSE`.

## Local development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

## Update content

- Publications, education, projects, and experience: `src/data/profile.ts`
- Biography and homepage: `src/pages/index.astro`
- Styles: `src/styles/global.css`
- Public CV: `src/pages/cv.astro` (the source PDF is used only as reference and is not published)
- Portrait: `public/portrait.jpg`

## Publishing

The `Deploy website` GitHub Actions workflow builds and deploys the site to GitHub Pages on every push to `main`.

## Content sources

Owner-provided CV and portrait. Publication metadata checked against the owner's Google Scholar profile and arXiv on September 23, 2026.

- https://scholar.google.com/citations?user=L3XEWtwAAAAJ
- https://arxiv.org/abs/2607.23961 (SPSC 2026 accepted)
- https://arxiv.org/abs/2608.27176 (preprint)
- https://arxiv.org/abs/2512.14687 (preprint; first three authors contributed equally)

Dates and research descriptions follow the supplied CV. The Spoken DialogSum title follows the public preprint; the CV describes a later submission title.

The original Spoken DialogSum audio demo returned HTTP 404 when checked; the website links to its paper instead.
