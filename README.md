# Templates Portfolio

A private master library for collecting authorized website-reconstruction studies, extracted design systems, rebuilt implementations, and QA records in one place before selected concepts are converted into original standalone templates.

This repository keeps the existing single-URL reconstruction workflow while adding a portfolio layer, a Dembrandt-first intake command, typed metadata, dashboard filtering, per-template detail views, and desktop/mobile smoke tests.

## Authorized Use

Use the reconstruction and extraction tools only on sites you own, licensed templates, or pages you have permission to analyze and recreate. Reference records may document third-party sites for internal analysis where permitted, but third-party trademarks, branding, copy, logos, illustrations, video, 3D assets, and protected or unlicensed media are not commercial template assets.

A template cannot be marked `ready-to-commercialize` until source branding/copy/media have been removed or replaced, naming is original, the implementation is independently reusable, and QA passes.

## Quick Start

```bash
npm install
npx -y dembrandt install-browser
npm run template:intake -- --url https://example.com/page --slug example-page --name "Example Page"
npm run dev
```

Open the local app to browse the private Templates Portfolio.

## Template Folder Contract

Each template lives under:

```text
templates/<slug>/
  reference/
  design/
  app/
  assets/
  qa/
  template.json
```

- `reference/` stores source metadata, screenshots, and observation notes.
- `design/` stores Dembrandt extraction output and generated design-system artifacts.
- `app/` is the reconstructed implementation workspace.
- `assets/` contains permitted, original, generated, or replacement assets.
- `qa/` stores build, responsive, interaction, and visual-review notes.
- `template.json` is the canonical portfolio metadata record.

## Metadata Statuses

Status progression is intentionally limited to:

```text
captured -> extracted -> rebuilding -> qa -> complete -> ready-to-commercialize
```

`ready-to-commercialize` also requires `commercialReady`, `sourceBrandRemoved`, and `qaPassed` to be true.

## Intake Command

```bash
npm run template:intake -- \
  --url https://example.com/page \
  --slug example-page \
  --name "Example Page" \
  --category cinematic,landing-page \
  --motion high
```

Defaults are `landing-page` and `medium` motion. The intake command creates the template folder, writes metadata and source records, then runs Dembrandt. Successful extraction changes status from `captured` to `extracted`.

If extraction fails, the template remains retryable at `captured`, existing artifacts are preserved, and `blockedReason` records the failure. A completed template is not overwritten without `--force`; forced replacement preserves prior metadata under `template-history/`.

## Dembrandt Prerequisite

Dembrandt uses Chromium. Install the matching browser once per environment:

```bash
npx -y dembrandt install-browser
```

Dembrandt extracts DOM-derived colors, typography, spacing, borders, shadows, component styling, breakpoints, and motion information. Canvas/WebGL content may need screenshot/reference-driven reconstruction because it may not expose equivalent DOM styles.

## Reconstruction Handoff

After intake:

1. Review `templates/<slug>/design`.
2. Fill the optional Portfolio Template fields in `TARGET.md`.
3. Use the existing browser-capable single-URL reconstruction workflow on an authorized target.
4. Work inside `templates/<slug>/app`.
5. Change status to `rebuilding` during implementation.
6. Change status to `qa` when ready for comparison.
7. Record build, desktop/mobile, interaction, and visual results under `qa/`.
8. Set `complete` only after those reviews pass.

When the Portfolio Template fields in `TARGET.md` are blank, existing single-URL behavior remains unchanged.

See `docs/template-workflow.md` for the detailed handoff.

## Portfolio UI

The Next.js app discovers `templates/*/template.json` without hard-coded imports and provides:

- template cards
- category filtering
- status filtering
- internal/commercial-readiness filtering
- template detail pages
- source-reference links
- design/app/QA locations
- commercialization-readiness state

The initial benchmark is `vigil-inspired`, recorded as an internal-only motion-heavy reference. It begins at `captured` and is not commercial-ready.

## QA

Each template QA record should cover:

- production build
- desktop layout
- mobile layout
- interactions
- visual differences
- unsupported Canvas/WebGL behavior
- commercialization blockers

## Commands

```bash
npm run dev              # Start Next.js
npm run build            # Production build
npm run lint             # ESLint
npm test                 # Unit and component tests
npm run test:watch       # Watch unit/component tests
npm run test:e2e         # Playwright desktop + mobile smoke tests
npm run template:intake  # Create/extract a template entry
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Dembrandt
- Vitest + Testing Library
- Playwright

## CI

Templates Portfolio CI runs dependency installation, unit/component tests, ESLint, a production Next.js build, Chromium installation, and Playwright smoke tests. CI does not run Dembrandt against third-party websites; extraction is an explicit operator action.

## Commercial Packaging Later

Phase 1 is a private master library. There is no marketplace, checkout, licensing portal, customer account system, or automated storefront publication. Once a template satisfies the commercialization boundary, it can later be exported into a separate repository/product with original branding, copy, naming, and properly licensed assets.

## License

The repository code retains its applicable license. Third-party reference material remains subject to its own rights and terms.
