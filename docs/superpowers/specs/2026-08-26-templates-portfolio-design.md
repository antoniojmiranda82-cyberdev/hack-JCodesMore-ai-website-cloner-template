# Templates Portfolio Design

## Purpose
Build a private master Templates Portfolio inside the existing website-cloner repository. The portfolio will collect reconstructed website templates in one place first, then later allow selected templates to be cleaned, branded independently, and packaged as standalone commercial products.

## Goals
- Keep all captured and rebuilt templates in one repository.
- Combine Dembrandt design-system extraction with the existing AI website cloner workflow.
- Preserve source/reference material separately from reusable implementation code.
- Track template status from capture through commercial readiness.
- Support many template types, including cinematic, 3D/WebGL, SaaS, product, portfolio, agency, and landing-page designs.
- Make it easy to split a finished template into its own repository or product later.

## Non-Goals for Phase 1
- No public marketplace.
- No checkout, licensing portal, or customer accounts.
- No automated publication to storefronts.
- No attempt to redistribute third-party trademarks, logos, copy, or protected assets.
- No requirement to perfectly reproduce Canvas/WebGL internals when those cannot be extracted from DOM data.

## Architecture

### 1. Master Portfolio Repository
Use the existing `hack-JCodesMore-ai-website-cloner-template` repository as the master system because it already contains the cloning workflow, `TARGET.md`, Next.js application, docs, and Claude/agent instructions.

Add a top-level template library:

```text
templates/
  <template-slug>/
    reference/
    design/
    app/
    assets/
    qa/
    template.json
```

### 2. Template Entry Structure
Each template is isolated and self-describing.

- `reference/`
  - source URL metadata
  - screenshots
  - notes about sections, interactions, motion, and responsive behavior
  - source attribution/reference notes

- `design/`
  - Dembrandt JSON output
  - DTCG design tokens when available
  - generated `DESIGN.md`
  - Tailwind theme output when useful
  - typography, spacing, color, border, shadow, motion, and component findings

- `app/`
  - reconstructed Next.js implementation
  - template-specific components, styles, routes, and supporting code
  - no dependency on the original site's protected branding for commercial-ready builds

- `assets/`
  - permitted local assets
  - generated or replacement assets
  - placeholder assets used during reconstruction

- `qa/`
  - reference screenshots
  - rebuilt screenshots
  - visual diff results
  - responsive test notes
  - interaction test notes

- `template.json`
  - canonical metadata for the portfolio dashboard and automation

## Metadata Model
Each `template.json` should include at least:

```json
{
  "id": "vigil-inspired",
  "name": "Vigil Inspired",
  "sourceUrl": "https://horizonx.so/explore/vigil",
  "category": ["cinematic", "3d-webgl", "landing-page"],
  "stack": ["nextjs", "react", "tailwind"],
  "motionLevel": "high",
  "status": "captured",
  "commercialReady": false,
  "sourceBrandRemoved": false,
  "qaPassed": false
}
```

Allowed status progression for Phase 1:

```text
captured -> extracted -> rebuilding -> qa -> complete -> ready-to-commercialize
```

## Intake Pipeline

### Stage A: Target Selection
Input can be a single page URL or an approved list of URLs.

The pipeline creates or updates the matching template folder and records the source URL in `template.json`.

### Stage B: Dembrandt Extraction
Run Dembrandt before reconstruction to collect the design system.

Expected outputs include:
- colors
- typography
- spacing
- borders
- shadows
- motion tokens
- component styles
- breakpoints
- framework/fingerprint information

For JavaScript-heavy pages, use the slower extraction mode when necessary. For multiple related pages, Dembrandt may crawl or merge several pages to strengthen token confidence.

Canvas/WebGL content is treated as a visual reference rather than a DOM-extractable design surface.

### Stage C: Cloner Reconstruction
Feed the target URL plus extracted design information into the existing `/clone-website` workflow.

The cloner remains responsible for:
- browser reconnaissance
- screenshots
- interaction inspection
- component specification
- section construction
- route assembly
- responsive reconstruction
- visual comparison

### Stage D: QA
For each template, verify:
- production build succeeds
- no missing routes or assets required by the template
- desktop and mobile layouts render
- major interactive states work
- visual differences are documented
- unsupported WebGL/canvas behavior is explicitly noted

### Stage E: Portfolio Registration
The master Next.js app reads template metadata and surfaces the entry in the private portfolio dashboard.

## Portfolio Dashboard
The internal dashboard should provide:
- template cards with preview image
- name and category
- source/reference URL
- motion level
- technology stack
- current status
- QA state
- commercial-readiness state

Filters for Phase 1:
- Cinematic
- 3D/WebGL
- SaaS
- Product
- Portfolio
- Agency
- Landing Page
- Status
- Commercial readiness

Each template detail view should expose links or panels for reference, design tokens, reconstructed preview, QA results, and metadata.

## Commercialization Boundary
The private master portfolio may retain source-reference information for analysis. A template cannot move to `ready-to-commercialize` until:
- third-party logos and trademarks are removed
- third-party copy is replaced
- protected or unlicensed media is removed or replaced
- implementation is independently reusable
- naming is original
- QA passes on the independent version

Commercial packaging will be a later phase and may export a template into a separate repository.

## Error Handling
- If Dembrandt cannot inspect a canvas/WebGL section, record the limitation and continue with browser screenshots and manual/agent reconstruction.
- If a page fails to load, mark the template as blocked rather than silently creating an incomplete result.
- If extraction succeeds but cloning fails, preserve extraction artifacts for retry.
- If visual QA fails, keep status at `qa` and store failure notes under `qa/`.
- Never overwrite a completed template without preserving prior metadata or an explicit replacement decision.

## Testing Strategy
Phase 1 tests should cover:
- metadata schema validation
- template discovery from `templates/*/template.json`
- dashboard rendering with multiple categories/statuses
- one successful Dembrandt extraction fixture
- one cloner intake fixture
- build/lint for the portfolio app
- desktop and mobile smoke checks
- a visual comparison workflow for at least one test template

## First Benchmark
Use a HorizonX page as the first private benchmark, starting with a page such as Vigil because it exercises motion-heavy behavior and exposes the limits between DOM-extractable design data and WebGL/canvas visuals.

The benchmark is for internal analysis and reconstruction testing. It is not considered sellable until the commercialization boundary requirements are met.

## Phase 1 Deliverable
A private Templates Portfolio that can hold multiple reconstructed templates in one repository, automatically capture design-system data before reconstruction, display all entries in one internal dashboard, and track each template from source capture through commercial-readiness review.
