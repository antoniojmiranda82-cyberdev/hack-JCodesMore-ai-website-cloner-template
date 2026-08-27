# AI Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a previewable five-chapter cinematic AI-startup template with an original medieval night environment, live WebGL, scroll-driven camera travel, editable content, responsive fallbacks, and QA.

**Architecture:** Add a dedicated `/showcase/ai-template` route so the private Templates Portfolio remains intact. Keep content, journey math, rendering, and editorial presentation isolated. Use native Three.js for the scene and Lenis for scroll smoothing, with a static fallback when WebGL or reduced-motion constraints require it.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js, Lenis, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-26-ai-template-design.md`

## Global Constraints

- Original geometry, textures, camera path, copy, naming, and commercial assets only.
- No HorizonX branding, copy, screenshots, protected media, exact geometry, exact camera route, or material maps.
- No QCore or Quantum Shadow visual motifs.
- Five chapters: The Approach, The Threshold, The Inner Ward, The Keep, The Watch.
- Desktop gets the full journey; mobile gets reduced scene complexity; reduced-motion gets stable viewpoints.
- If WebGL fails, all five chapters remain readable as a static responsive page.

---

### Task 1: Add runtime dependencies and CI support

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/templates-portfolio-ci.yml`

**Interfaces:**
- Produces: imports for `three` and `lenis`; CI that verifies the implementation branch.

- [ ] Add `three` and `lenis` runtime dependencies and `@types/three` as a dev dependency.
- [ ] Regenerate `package-lock.json` with `npm install` in CI-capable environment.
- [ ] Extend CI push branches to include the implementation branch.
- [ ] Run `npm ci`, `npm test`, `npm run lint`, and `npm run build`.
- [ ] Commit dependency/CI setup.

### Task 2: Build the editable content and journey model

**Files:**
- Create: `src/features/ai-template/content.ts`
- Create: `src/features/ai-template/journey.ts`
- Test: `tests/ai-template-content.test.ts`
- Test: `tests/ai-template-journey.test.ts`

**Interfaces:**
- Produces: `AI_TEMPLATE_CONTENT`, `AI_CHAPTERS`, `getJourneyState(progress)`.
- `getJourneyState(progress: number)` returns `{ chapterIndex: number; chapterProgress: number; cameraZ: number; cameraY: number; lookY: number }`.

- [ ] Write tests asserting five chapters, original placeholder copy, valid CTA fields, clamped progress, chapter boundaries, and continuous camera values.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement typed content configuration and deterministic journey mapping.
- [ ] Run targeted tests and confirm they pass.
- [ ] Commit content/journey model.

### Task 3: Build the live Three.js environment

**Files:**
- Create: `src/features/ai-template/scene.ts`
- Create: `src/features/ai-template/ai-scene.tsx`
- Test: `tests/ai-template-scene.test.ts`

**Interfaces:**
- Consumes: `getJourneyState(progress)`.
- Produces: `AIScene({ progress, reducedMotion, onReady, onFailure })`.

- [ ] Write a scene helper test for renderer-independent geometry descriptors and quality selection.
- [ ] Implement an original gatehouse-like environment from primitive geometry, arches/walls/towers, cool moonlight, warm cresset lights, fog, and a non-branded night sky.
- [ ] Cap device pixel ratio and lower geometry/effect density on mobile.
- [ ] Dispose renderer, materials, geometries, and animation frame on unmount.
- [ ] Catch WebGL initialization errors and call `onFailure`.
- [ ] Run targeted tests, lint, and build.
- [ ] Commit scene layer.

### Task 4: Build scroll control and editorial chapters

**Files:**
- Create: `src/features/ai-template/ai-template-experience.tsx`
- Create: `src/features/ai-template/editorial-chapter.tsx`
- Create: `src/features/ai-template/ai-template.css`
- Create: `src/app/showcase/ai-template/page.tsx`
- Test: `tests/ai-template-experience.test.tsx`

**Interfaces:**
- Consumes: `AIScene`, `AI_TEMPLATE_CONTENT`, `getJourneyState`.
- Produces: public preview route `/showcase/ai-template`.

- [ ] Write a component test asserting all five chapter headings and CTA content render without WebGL.
- [ ] Implement Lenis lifecycle and normalized scroll-progress tracking.
- [ ] Add fixed canvas background, five full-height editorial chapter zones, chapter indicator, loading state, CTA, and static fallback.
- [ ] Add `prefers-reduced-motion` handling that disables Lenis interpolation and uses stable chapter presentation.
- [ ] Keep visual palette near-black, cool stone, warm firelight, and parchment text.
- [ ] Run component tests, lint, and build.
- [ ] Commit experience route.

### Task 5: Connect the preview to the portfolio

**Files:**
- Modify: `src/app/templates/[slug]/page.tsx`
- Modify: `templates/vigil-inspired/template.json`

**Interfaces:**
- Produces: a visible `Open Live Preview` link for the benchmark-derived AI template and updated metadata without marking it commercially ready prematurely.

- [ ] Add a preview link for the benchmark entry to `/showcase/ai-template`.
- [ ] Rename the portfolio-facing template entry to `AI Template Design` while keeping the source URL only as private benchmark metadata.
- [ ] Set stack to include `threejs` and `lenis`; keep `commercialReady`, `sourceBrandRemoved`, and `qaPassed` false until final QA.
- [ ] Run metadata tests and build.
- [ ] Commit portfolio integration.

### Task 6: Add desktop/mobile/reduced-motion smoke coverage

**Files:**
- Create: `e2e/ai-template.spec.ts`

**Interfaces:**
- Consumes: `/showcase/ai-template`.

- [ ] Add Playwright smoke checks for title, all five chapter landmarks, CTA visibility, canvas-or-fallback presence, and no page crash.
- [ ] Add reduced-motion emulation check to confirm static readable chapters.
- [ ] Run Chromium desktop and Pixel 5 projects.
- [ ] Run full `npm test`, `npm run lint`, `npm run build`, and `npm run test:e2e`.
- [ ] Commit QA coverage.

### Task 7: Final verification and preview handoff

**Files:**
- Modify: `templates/vigil-inspired/qa/README.md`
- Modify: `templates/vigil-inspired/template.json`

**Interfaces:**
- Produces: verified preview candidate and QA record.

- [ ] Record desktop, mobile, reduced-motion, WebGL fallback, CTA, and build results in QA notes.
- [ ] Set `qaPassed` true only if all required checks pass.
- [ ] Keep `commercialReady` false until asset/licensing review is complete.
- [ ] Run fresh full CI from the final head commit.
- [ ] Open a PR into `master` with verification evidence.
- [ ] If a connected deployment target is available, create a preview deployment from the feature branch and return the preview URL.
