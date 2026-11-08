# Denis Zagitov — personal website

A personal presentation site built with Astro and TypeScript. Russian is the primary language; English lives under `/en/`. The design has light, dark, and system appearance settings.

## Local development

```sh
npm install
npm run dev
```

Open the Local URL printed by Astro (normally http://127.0.0.1:4321/). The project pins a development Node executable in devDependencies so npm scripts use a compatible runtime without changing the globally installed Node. The system Node used for installation must be at least 22.12.0; the application tooling uses Node 22.23.4.

```sh
npm run check
npm run build
npm run verify
npm run preview
```

The build is static and outputs to `dist/`, ready for GitHub Pages. This branch is a local preview: no deployment workflow has been enabled.

## Pages and homepage order

- `/`, `/en/`: introduction → profile and expertise → work experience → approach → achievements archive → contact.
- `/cv/`, `/en/cv/`: extended résumé with a print stylesheet (browser Print / Save as PDF).
- `/portfolio/`, `/en/portfolio/`: archive grouped by year, with year selection, image viewing, and links to originals.
- Existing diploma detail URLs are generated from the original portfolio metadata.

## Source ownership

- `src/data/profile.ts`: Russian/English text, career facts, and navigation labels. Career descriptions derive from the public LinkedIn profile and the previous site. Scale figures retain team attribution.
- `src/components/`: shared homepage, résumé, and archive components.
- `src/layouts/SiteLayout.astro`: shared navigation, metadata, appearance, and language links.
- `src/styles/global.css`: typography, responsive layout, both colour themes, and printing.
- `src/styles/heritage.css`: emerald/gold appearance, polished metal, glass surfaces, and responsive lighting effects.
- `src/scripts/visual-effects.ts`: scroll reveals, reading progress, and pointer-driven lighting; respects reduced-motion preferences and skips pointer effects on touch devices.
- `assets/images/portfolio/<year>/`: preserved original archive files; keep these paths and bytes.
- `_portfolio/`: original metadata retained as the mapping for existing public diploma URLs.
- `images/profile.png`: preserved source portrait.

## Archive preparation

`npm run prepare:assets` runs automatically before development and production builds. It copies the original diploma assets to their previous public paths and generates small WebP previews. All originals, including PDF files, remain unmodified. Generated copies in `public/assets/images/portfolio/` and `public/media/` are ignored by Git and rebuilt from source.

The generated `src/data/diplomas.json` contains the complete catalogue: folder year, original URL, preview, format, and previous detail route. Generic titles are intentional until the documents are individually described; they make no assumptions about an issuer or qualification.

`npm run verify` checks archive coverage, original-file SHA256 equality, old diploma routes, internal links and anchors, language metadata, and the presence of both appearance controls in the static output.

## Migration boundary

The previous Jekyll source is retained while this Astro version is reviewed. It is not read by the new application, apart from the original archive mapping above. Historical blog, talk, and publication pages have not been migrated in this first version. Existing unrelated working-tree changes are preserved.
