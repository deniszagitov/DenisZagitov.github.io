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

The build is static and outputs to `dist/`. GitHub Pages publishes the `master` branch through `.github/workflows/deploy-pages.yml`: install locked dependencies, check, build, verify, upload the static artifact, then deploy. Repository Pages settings must use GitHub Actions (`build_type: workflow`). Feature branches remain local previews until merged to `master`.

## Pages and homepage order

- `/`, `/en/`: introduction → profile and expertise → work experience → ways to work together → achievements archive → contact.
- `/cv/`, `/en/cv/`: extended résumé with a print stylesheet (browser Print / Save as PDF).
- `/portfolio/`, `/en/portfolio/`: archive grouped by year, with year selection, image viewing, and links to originals.
- Existing diploma detail URLs are generated from the original portfolio metadata.
- `/talks/`, `/talks/<date>/`, `/year-archive/`, `/posts/2012/08/language/`: original talks and writing. Previous talk `.html` URLs redirect to their corresponding pages; the historic blog URL is intentionally retained despite its different publication year.
- `/profile.md`, `/llms.txt`: a public Markdown fact sheet and discovery index generated from the same profile data. These are optional conveniences for readers and tools, not a Google ranking mechanism.

## Source ownership

- `src/data/profile.ts`: Russian/English text, career facts, and navigation labels. Career descriptions derive from the public LinkedIn profile and the previous site. Scale figures retain team attribution.
- `src/components/`: shared homepage, résumé, and archive components.
- `src/layouts/SiteLayout.astro`: shared navigation, metadata, appearance, and language links.
- `src/data/seo.ts`: stable person/site identifiers, page types, paired locale routes, and the actual profile update date. Only paired translations receive `hreflang`; archive document pages remain excluded from indexing.
- `src/data/materials.ts` and `src/components/MaterialPage.astro`: render the original Markdown talks and article without importing template publications. Original presentation files and referenced article images are copied during asset preparation.
- `src/styles/global.css`: typography, responsive layout, both colour themes, and printing.
- `src/styles/heritage.css`: emerald/gold appearance, polished metal, glass surfaces, and responsive lighting effects.
- `src/data/architecture.ts`: Russian/English copy for the five architecture layers, technology explanations, and references to real career experience. This is the source to edit when refining the architecture text.
- `src/data/architecture-diagrams.ts` and `src/components/ArchitectureDiagram.astro`: labelled node-and-connection diagrams for each layer. Selection brings a plane forward; technology details highlight the corresponding nodes and connections. AWS is personal-project experience; Java is not a programming skill.
- `src/components/SpatialExpertise.astro` and `src/styles/spatial.css`: five glass layers from sources to AI, with native radio selection, a layer inspector, technology details, and six animated data packets. The main overview and technology names remain readable without JavaScript.
- `src/scripts/spatial-scene.ts`: layer focus, inspection, technology highlighting, pause/resume, depth, and lighting. CSS particle motion pauses outside the viewport, in hidden tabs, and while focusing on a layer; reduced-motion preferences disable it. No WebGL dependencies or JavaScript animation loop.
- `docs/research/datanerd-skills-2026-11-08.md`: dated market research used to choose which verified technologies to make prominent. Salary data is not published as a personal claim.
- `docs/research/profile-positioning-and-discovery-2026-11-08.md`: evidence boundaries, search intent, and discovery implementation decisions.
- `src/scripts/visual-effects.ts`: scroll reveals, reading progress, and pointer-driven lighting; respects reduced-motion preferences and skips pointer effects on touch devices.
- `assets/images/portfolio/<year>/`: preserved original archive files; keep these paths and bytes.
- `_portfolio/`: original metadata retained as the mapping for existing public diploma URLs.
- `images/profile.png`: preserved source portrait.

## Archive preparation

`npm run prepare:assets` runs automatically before development and production builds. It copies the original diploma assets to their previous public paths and generates small WebP previews. All originals, including PDF files, remain unmodified. Generated copies in `public/assets/images/portfolio/` and `public/media/` are ignored by Git and rebuilt from source.

The generated `src/data/diplomas.json` contains the complete catalogue: folder year, original URL, preview, format, and previous detail route. Generic titles are intentional until the documents are individually described; they make no assumptions about an issuer or qualification.

`npm run verify` checks archive coverage, original-file SHA256 equality, old diploma and material routes, internal links and anchors, distinct page descriptions, canonical URLs, reciprocal language metadata, structured profile identity, sitemap indexability, public fact-sheet discovery, and appearance controls in the static output.

## Migration boundary

The previous Jekyll source is retained. Astro reads the original diploma mapping, two talks, and one article. Real presentation files and article images are retained; sample publications and template demonstration pages are not published. Existing unrelated working-tree changes are preserved.

## Search visibility after publication

`robots.txt` permits crawling and points to the sitemap. The sitemap lists indexable primary pages, without document duplicates or redirect aliases. All professional copy and technology names are built into HTML, with no client rendering requirement. Profile metadata uses the same public facts as the visible pages; it does not claim ratings, certifications, revenue effects, or individual ownership of team results.

Search Console / Bing Webmaster verification and index requests require the site owner's authenticated account; deployment alone does not submit them. Use the site's actual query and indexing reports to choose future content. Search rankings, inclusion in AI answers, and crawl times are not guaranteed by these changes. Do not add pages for keyword variations, hidden instructions to agents, or fabricated proof.

After a changed version is live, `npm run notify:search` sends the sitemap's public page URLs to IndexNow. The script verifies that the public proof file is live before submission. `public/indexnow-key.txt` is a public ownership proof, not an account credential. Run only for actual published updates. HTTP 200 means receipt; HTTP 202 means receipt with key validation pending. Neither establishes indexing. IndexNow notifications are separate from account-based search performance reports and Google Search Console.
