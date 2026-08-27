# Templates Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private Templates Portfolio inside the existing website-cloner repository that stores many reconstructed templates, runs Dembrandt before cloning, exposes template metadata in an internal dashboard, and tracks each template from capture through commercial-readiness review.

**Architecture:** Keep each template isolated under `templates/<slug>/` with reference, design, app, assets, QA, and canonical metadata. Add a typed metadata/discovery layer to the Next.js app, then build an internal dashboard and template detail route on top of that data. Add a small Node-based intake CLI that creates template folders, runs Dembrandt, records extraction results, and prepares the existing cloner workflow without coupling the portfolio UI to browser automation.

**Tech Stack:** Next.js 16.2.1, React 19.2.4, TypeScript 5, Tailwind CSS 4, Node.js 20+, Dembrandt CLI, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-26-templates-portfolio-design.md`

## Global Constraints

- Phase 1 is private/internal only; no public marketplace, checkout, licensing portal, customer accounts, or storefront publication.
- Template status progression is exactly: `captured -> extracted -> rebuilding -> qa -> complete -> ready-to-commercialize`.
- Third-party logos, trademarks, copy, and protected/unlicensed media must not be treated as commercial-ready assets.
- Canvas/WebGL sections may remain screenshot/reference-driven when DOM extraction cannot inspect them.
- A template may reach `ready-to-commercialize` only after source branding/copy/media removal, independent reuse verification, original naming, and QA pass.
- Existing `/clone-website` behavior remains intact; the new intake layer prepares and feeds it rather than replacing it.
- Do not overwrite a completed template silently; require `--force` and preserve prior metadata history.

---

## File Structure

### New files

- `src/types/template.ts` — canonical template metadata types and enums.
- `src/lib/template-schema.ts` — runtime metadata validation.
- `src/lib/templates.ts` — filesystem discovery and template lookup.
- `src/components/templates/template-card.tsx` — dashboard card.
- `src/components/templates/template-filters.tsx` — client-side filters.
- `src/components/templates/status-badge.tsx` — status visualization.
- `src/app/templates/[slug]/page.tsx` — private template detail route.
- `scripts/template-intake.mjs` — create/update template folder and orchestrate Dembrandt extraction.
- `scripts/lib/template-metadata.mjs` — intake-side metadata helpers.
- `scripts/lib/run-dembrandt.mjs` — Dembrandt process wrapper.
- `tests/template-schema.test.ts` — metadata validation tests.
- `tests/templates.test.ts` — filesystem discovery tests.
- `tests/template-intake.test.ts` — intake orchestration tests.
- `tests/components/template-card.test.tsx` — card rendering tests.
- `tests/components/template-filters.test.tsx` — filter behavior tests.
- `e2e/templates-portfolio.spec.ts` — desktop/mobile smoke tests.
- `templates/.gitkeep` — keeps empty portfolio root in git.
- `templates/vigil-inspired/template.json` — first benchmark metadata.
- `templates/vigil-inspired/reference/source.json` — benchmark source record.
- `templates/vigil-inspired/reference/README.md` — source/reference notes.
- `templates/vigil-inspired/design/.gitkeep`
- `templates/vigil-inspired/app/.gitkeep`
- `templates/vigil-inspired/assets/.gitkeep`
- `templates/vigil-inspired/qa/README.md`

### Modified files

- `package.json` — add test/e2e/intake scripts and test dependencies.
- `src/app/page.tsx` — replace starter page with Templates Portfolio dashboard.
- `src/app/globals.css` — add dashboard-specific utility styles only where Tailwind utilities are insufficient.
- `src/app/layout.tsx` — update metadata/title for Templates Portfolio.
- `README.md` — document portfolio workflow and commands.
- `TARGET.md` — document how intake-generated target information feeds `/clone-website` without breaking current usage.

---

### Task 1: Add canonical template metadata and runtime validation

**Files:**
- Create: `src/types/template.ts`
- Create: `src/lib/template-schema.ts`
- Create: `tests/template-schema.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `TemplateStatus`, `MotionLevel`, `TemplateMetadata`, `validateTemplateMetadata(input: unknown): TemplateMetadata`.
- Consumes: no earlier task output.

- [ ] **Step 1: Add Vitest test dependencies and scripts**

Update `package.json` scripts to include:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

Add dev dependencies:

```json
{
  "@playwright/test": "^1.55.0",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/react": "^16.3.0",
  "jsdom": "^26.1.0",
  "vitest": "^3.2.4"
}
```

Run:

```bash
npm install
```

Expected: lockfile updates successfully.

- [ ] **Step 2: Write failing metadata validation tests**

Create `tests/template-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateTemplateMetadata } from "@/lib/template-schema";

const valid = {
  id: "vigil-inspired",
  name: "Vigil Inspired",
  sourceUrl: "https://horizonx.so/explore/vigil",
  category: ["cinematic", "3d-webgl", "landing-page"],
  stack: ["nextjs", "react", "tailwind"],
  motionLevel: "high",
  status: "captured",
  commercialReady: false,
  sourceBrandRemoved: false,
  qaPassed: false,
};

describe("validateTemplateMetadata", () => {
  it("accepts a valid metadata record", () => {
    expect(validateTemplateMetadata(valid)).toEqual(valid);
  });

  it("rejects an unsupported status", () => {
    expect(() =>
      validateTemplateMetadata({ ...valid, status: "published" }),
    ).toThrow(/status/i);
  });

  it("rejects commercial-ready metadata that has not cleared branding and QA", () => {
    expect(() =>
      validateTemplateMetadata({
        ...valid,
        status: "ready-to-commercialize",
        commercialReady: true,
      }),
    ).toThrow(/commercial/i);
  });
});
```

- [ ] **Step 3: Run the test and verify failure**

Run:

```bash
npm test -- tests/template-schema.test.ts
```

Expected: FAIL because `@/lib/template-schema` does not exist.

- [ ] **Step 4: Implement canonical types**

Create `src/types/template.ts`:

```ts
export const TEMPLATE_STATUSES = [
  "captured",
  "extracted",
  "rebuilding",
  "qa",
  "complete",
  "ready-to-commercialize",
] as const;

export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];
export type MotionLevel = "low" | "medium" | "high";

export interface TemplateMetadata {
  id: string;
  name: string;
  sourceUrl: string;
  category: string[];
  stack: string[];
  motionLevel: MotionLevel;
  status: TemplateStatus;
  commercialReady: boolean;
  sourceBrandRemoved: boolean;
  qaPassed: boolean;
  previewImage?: string;
  blockedReason?: string;
}
```

- [ ] **Step 5: Implement runtime validation**

Create `src/lib/template-schema.ts`:

```ts
import {
  TEMPLATE_STATUSES,
  type MotionLevel,
  type TemplateMetadata,
  type TemplateStatus,
} from "@/types/template";

const motionLevels: MotionLevel[] = ["low", "medium", "high"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateTemplateMetadata(input: unknown): TemplateMetadata {
  if (!input || typeof input !== "object") throw new Error("Template metadata must be an object");
  const value = input as Record<string, unknown>;

  for (const field of ["id", "name", "sourceUrl"] as const) {
    if (typeof value[field] !== "string" || value[field].length === 0) {
      throw new Error(`${field} must be a non-empty string`);
    }
  }

  if (!isStringArray(value.category) || !value.category.length) throw new Error("category must be a non-empty string array");
  if (!isStringArray(value.stack) || !value.stack.length) throw new Error("stack must be a non-empty string array");
  if (!motionLevels.includes(value.motionLevel as MotionLevel)) throw new Error("motionLevel is invalid");
  if (!TEMPLATE_STATUSES.includes(value.status as TemplateStatus)) throw new Error("status is invalid");

  for (const field of ["commercialReady", "sourceBrandRemoved", "qaPassed"] as const) {
    if (typeof value[field] !== "boolean") throw new Error(`${field} must be boolean`);
  }

  if (
    value.status === "ready-to-commercialize" &&
    (!value.commercialReady || !value.sourceBrandRemoved || !value.qaPassed)
  ) {
    throw new Error("commercial readiness requires branding removal and QA pass");
  }

  return value as unknown as TemplateMetadata;
}
```

- [ ] **Step 6: Run tests and lint**

Run:

```bash
npm test -- tests/template-schema.test.ts
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/types/template.ts src/lib/template-schema.ts tests/template-schema.test.ts
git commit -m "feat: add template metadata schema"
```

---

### Task 2: Add filesystem discovery and lookup

**Files:**
- Create: `src/lib/templates.ts`
- Create: `tests/templates.test.ts`
- Create: `tests/fixtures/templates/alpha/template.json`
- Create: `tests/fixtures/templates/beta/template.json`

**Interfaces:**
- Consumes: `TemplateMetadata`, `validateTemplateMetadata` from Task 1.
- Produces: `discoverTemplates(rootDir?: string): Promise<TemplateMetadata[]>`, `getTemplateBySlug(slug: string, rootDir?: string): Promise<TemplateMetadata | null>`.

- [ ] **Step 1: Write failing discovery tests**

Create fixture JSON files using valid records where `alpha` is `captured` and `beta` is `qa`.

Create `tests/templates.test.ts`:

```ts
import path from "node:path";
import { describe, expect, it } from "vitest";
import { discoverTemplates, getTemplateBySlug } from "@/lib/templates";

const root = path.join(process.cwd(), "tests/fixtures/templates");

describe("template discovery", () => {
  it("loads every direct child template.json", async () => {
    const templates = await discoverTemplates(root);
    expect(templates.map((template) => template.id)).toEqual(["alpha", "beta"]);
  });

  it("returns null for a missing slug", async () => {
    expect(await getTemplateBySlug("missing", root)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
npm test -- tests/templates.test.ts
```

Expected: FAIL because discovery functions do not exist.

- [ ] **Step 3: Implement discovery**

Create `src/lib/templates.ts`:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { validateTemplateMetadata } from "@/lib/template-schema";
import type { TemplateMetadata } from "@/types/template";

export async function discoverTemplates(
  rootDir = path.join(process.cwd(), "templates"),
): Promise<TemplateMetadata[]> {
  let entries;
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const templates = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const file = path.join(rootDir, entry.name, "template.json");
        const raw = await fs.readFile(file, "utf8");
        return validateTemplateMetadata(JSON.parse(raw));
      }),
  );

  return templates.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTemplateBySlug(
  slug: string,
  rootDir = path.join(process.cwd(), "templates"),
): Promise<TemplateMetadata | null> {
  const templates = await discoverTemplates(rootDir);
  return templates.find((template) => template.id === slug) ?? null;
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test -- tests/templates.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/templates.ts tests/templates.test.ts tests/fixtures/templates
git commit -m "feat: discover templates from portfolio library"
```

---

### Task 3: Build the private Templates Portfolio dashboard

**Files:**
- Create: `src/components/templates/status-badge.tsx`
- Create: `src/components/templates/template-card.tsx`
- Create: `src/components/templates/template-filters.tsx`
- Create: `tests/components/template-card.test.tsx`
- Create: `tests/components/template-filters.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `discoverTemplates()`, `TemplateMetadata`.
- Produces: dashboard at `/` with category/status/commercial filters.

- [ ] **Step 1: Configure Vitest DOM environment**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing card test**

Create `tests/components/template-card.test.tsx` with a valid fixture and assert that name, categories, status, motion level, and source link render.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TemplateCard } from "@/components/templates/template-card";

const template = {
  id: "vigil-inspired",
  name: "Vigil Inspired",
  sourceUrl: "https://horizonx.so/explore/vigil",
  category: ["cinematic", "3d-webgl"],
  stack: ["nextjs", "react"],
  motionLevel: "high" as const,
  status: "captured" as const,
  commercialReady: false,
  sourceBrandRemoved: false,
  qaPassed: false,
};

describe("TemplateCard", () => {
  it("renders portfolio metadata", () => {
    render(<TemplateCard template={template} />);
    expect(screen.getByText("Vigil Inspired")).toBeInTheDocument();
    expect(screen.getByText("captured")).toBeInTheDocument();
    expect(screen.getByText("cinematic")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement status badge and card**

`StatusBadge` should render status text and no business logic. `TemplateCard` should link its title/preview to `/templates/${template.id}`, render categories and stack as compact chips, and show `Internal only` when `commercialReady` is false.

- [ ] **Step 4: Write failing filter test**

Create `tests/components/template-filters.test.tsx` with two templates and assert selecting `Cinematic` hides the SaaS-only card.

- [ ] **Step 5: Implement client-side filter component**

`TemplateFilters` receives `templates: TemplateMetadata[]`, keeps category/status/commercial filter state, and renders filtered `TemplateCard` elements. Include an `All` option for each filter.

- [ ] **Step 6: Replace starter home page**

Implement `src/app/page.tsx` as a server component:

```tsx
import { TemplateFilters } from "@/components/templates/template-filters";
import { discoverTemplates } from "@/lib/templates";

export default async function Home() {
  const templates = await discoverTemplates();
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Private Library</p>
        <h1 className="mt-3 text-4xl font-semibold">Templates Portfolio</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Capture, reconstruct, QA, and prepare template concepts for later commercialization.
        </p>
      </header>
      <TemplateFilters templates={templates} />
    </main>
  );
}
```

Update `layout.tsx` metadata title to `Templates Portfolio` and description to `Private reconstructed template library`.

- [ ] **Step 7: Run tests, lint, build**

Run:

```bash
npm test -- tests/components
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts tests/setup.ts src/components/templates src/app/page.tsx src/app/layout.tsx src/app/globals.css tests/components
git commit -m "feat: add private templates portfolio dashboard"
```

---

### Task 4: Add template detail route

**Files:**
- Create: `src/app/templates/[slug]/page.tsx`
- Create: `tests/template-detail.test.ts`

**Interfaces:**
- Consumes: `getTemplateBySlug()` from Task 2.
- Produces: `/templates/<slug>` route with metadata, reference, design, QA, and commercial-readiness panels.

- [ ] **Step 1: Write route data test**

Test `getTemplateBySlug("alpha")` returns all fields required by the detail screen and invalid slug returns null.

- [ ] **Step 2: Implement detail route**

Use `notFound()` when lookup returns null. Render sections:

```text
Overview
Source Reference
Design Extraction
Reconstructed App
QA
Commercialization Readiness
```

Do not embed arbitrary source websites. Source URL is an external reference link only.

- [ ] **Step 3: Run lint/build**

```bash
npm run lint
npm run build
```

Expected: PASS with generated dynamic server route.

- [ ] **Step 4: Commit**

```bash
git add src/app/templates tests/template-detail.test.ts
git commit -m "feat: add template detail view"
```

---

### Task 5: Build the template intake CLI and Dembrandt wrapper

**Files:**
- Create: `scripts/lib/template-metadata.mjs`
- Create: `scripts/lib/run-dembrandt.mjs`
- Create: `scripts/template-intake.mjs`
- Create: `tests/template-intake.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces CLI: `npm run template:intake -- --url <url> --slug <slug> --name <name> [--category cinematic,landing-page] [--motion high] [--force]`.
- Produces: `createInitialMetadata()`, `assertSafeTemplateWrite()`, `runDembrandt()`.
- Consumes: Dembrandt through `npx -y dembrandt` and filesystem only.

- [ ] **Step 1: Add intake script**

Add to `package.json`:

```json
{
  "template:intake": "node scripts/template-intake.mjs"
}
```

- [ ] **Step 2: Write failing metadata helper tests**

Test that:

1. initial metadata status is `captured`;
2. a completed template cannot be overwritten without `force`;
3. failed extraction preserves `captured` metadata and records `blockedReason`.

- [ ] **Step 3: Implement metadata helper**

`scripts/lib/template-metadata.mjs` should export:

```js
export function createInitialMetadata({ slug, name, url, categories, motionLevel }) {
  return {
    id: slug,
    name,
    sourceUrl: url,
    category: categories,
    stack: ["nextjs", "react", "tailwind"],
    motionLevel,
    status: "captured",
    commercialReady: false,
    sourceBrandRemoved: false,
    qaPassed: false,
  };
}

export function assertSafeTemplateWrite(existing, force) {
  if (existing?.status === "complete" && !force) {
    throw new Error("Refusing to overwrite completed template without --force");
  }
}
```

- [ ] **Step 4: Implement Dembrandt wrapper**

`scripts/lib/run-dembrandt.mjs` uses `spawn` with argument arrays, never shell interpolation:

```js
import { spawn } from "node:child_process";

export function runDembrandt(url, outputDir, { slow = true } = {}) {
  const args = ["-y", "dembrandt", url, "--save-output", "--design-md", "--dtcg", "--tailwind"];
  if (slow) args.push("--slow");

  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      cwd: outputDir,
      stdio: "inherit",
      shell: false,
    });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Dembrandt exited ${code}`))));
  });
}
```

Before the first extraction in setup documentation, require:

```bash
npx -y dembrandt install-browser
```

- [ ] **Step 5: Implement intake CLI**

The CLI must:

1. parse required `--url`, `--slug`, `--name`;
2. default categories to `landing-page` and motion to `medium`;
3. create `reference`, `design`, `app`, `assets`, `qa` directories;
4. write `reference/source.json`;
5. write initial `template.json` atomically through a `.tmp` file + rename;
6. call `runDembrandt(url, designDir)`;
7. on success set status to `extracted`;
8. on failure retain artifacts, leave status `captured`, set `blockedReason`, and exit non-zero;
9. preserve `template-history/<timestamp>.json` before any forced replacement.

- [ ] **Step 6: Run tests**

```bash
npm test -- tests/template-intake.test.ts
```

Expected: PASS using a mocked process wrapper; tests must not hit HorizonX or launch Chromium.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json scripts tests/template-intake.test.ts
git commit -m "feat: add template intake and design extraction pipeline"
```

---

### Task 6: Connect intake output to the existing clone workflow

**Files:**
- Modify: `TARGET.md`
- Create: `docs/template-workflow.md`
- Create: `templates/vigil-inspired/reference/README.md`
- Create: `templates/vigil-inspired/qa/README.md`

**Interfaces:**
- Consumes: intake-created template folder and Dembrandt outputs.
- Produces: documented handoff from extraction to `/clone-website` and status update rules.

- [ ] **Step 1: Document the handoff contract**

`docs/template-workflow.md` must define:

```text
1. npm run template:intake -- --url URL --slug SLUG --name NAME
2. Review templates/SLUG/design output
3. Point TARGET.md to URL and templates/SLUG/app
4. Run claude --chrome
5. Run /clone-website URL
6. Set status rebuilding during construction
7. Set status qa when reconstruction is ready for comparison
8. Save QA notes under templates/SLUG/qa
9. Set complete only after build, responsive, interaction, and visual review pass
```

- [ ] **Step 2: Update TARGET.md without breaking existing single-page usage**

Add an optional `Portfolio Template` section with fields:

```text
Template slug:
Template app output directory:
Dembrandt design directory:
QA directory:
```

State that when these fields are blank, existing `/clone-website <target-url>` behavior is unchanged.

- [ ] **Step 3: Add benchmark reference/QA note templates**

`reference/README.md` records source URL, capture date, sections, interaction notes, WebGL/canvas limitations, and usage boundary.

`qa/README.md` has headings for build, desktop, mobile, interactions, visual differences, unsupported behavior, and commercialization blockers.

- [ ] **Step 4: Commit**

```bash
git add TARGET.md docs/template-workflow.md templates/vigil-inspired/reference/README.md templates/vigil-inspired/qa/README.md
git commit -m "docs: connect portfolio intake to cloning workflow"
```

---

### Task 7: Seed the first HorizonX benchmark safely

**Files:**
- Create: `templates/vigil-inspired/template.json`
- Create: `templates/vigil-inspired/reference/source.json`
- Create: `templates/vigil-inspired/design/.gitkeep`
- Create: `templates/vigil-inspired/app/.gitkeep`
- Create: `templates/vigil-inspired/assets/.gitkeep`
- Create: `templates/.gitkeep` only if needed before the benchmark folder exists.

**Interfaces:**
- Consumes: schema from Task 1 and folder contract from the spec.
- Produces: first dashboard-visible benchmark entry.

- [ ] **Step 1: Add benchmark metadata**

Create `templates/vigil-inspired/template.json`:

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

- [ ] **Step 2: Add source record**

Create `reference/source.json` with:

```json
{
  "url": "https://horizonx.so/explore/vigil",
  "purpose": "private benchmark for reconstruction and motion-heavy QA",
  "commercialUse": false,
  "notes": "Do not treat HorizonX branding, copy, logos, or protected assets as reusable commercial template material."
}
```

- [ ] **Step 3: Verify discovery and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: benchmark appears in the portfolio data set and build passes.

- [ ] **Step 4: Commit**

```bash
git add templates/vigil-inspired
 git commit -m "chore: seed vigil inspired benchmark template"
```

---

### Task 8: Add Playwright smoke tests for desktop and mobile

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/templates-portfolio.spec.ts`

**Interfaces:**
- Consumes: dashboard and detail routes from Tasks 3-4.
- Produces: smoke coverage for desktop and mobile layouts.

- [ ] **Step 1: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
```

- [ ] **Step 2: Write smoke test**

Create `e2e/templates-portfolio.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("portfolio opens benchmark detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Templates Portfolio" })).toBeVisible();
  await page.getByRole("link", { name: /Vigil Inspired/i }).first().click();
  await expect(page.getByRole("heading", { name: "Vigil Inspired" })).toBeVisible();
  await expect(page.getByText(/Commercialization Readiness/i)).toBeVisible();
});
```

- [ ] **Step 3: Install browser and run e2e**

```bash
npx playwright install chromium
npm run test:e2e
```

Expected: PASS in desktop and mobile projects.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts e2e
git commit -m "test: add templates portfolio smoke coverage"
```

---

### Task 9: Add CI verification and project documentation

**Files:**
- Create: `.github/workflows/templates-portfolio-ci.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: all tests and scripts from earlier tasks.
- Produces: repeatable CI gate for metadata, UI, build, and smoke tests.

- [ ] **Step 1: Add CI workflow**

Create `.github/workflows/templates-portfolio-ci.yml`:

```yaml
name: Templates Portfolio CI

on:
  push:
    branches: [master]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

Do not run Dembrandt against third-party sites in CI. Intake extraction remains an explicit operator action.

- [ ] **Step 2: Update README**

Document:

```text
Templates Portfolio overview
Folder contract
Metadata statuses
npm run template:intake usage
Dembrandt browser prerequisite
clone handoff
QA process
commercialization boundary
local tests
```

Include a compact quick start:

```bash
npm install
npx -y dembrandt install-browser
npm run template:intake -- --url https://example.com/page --slug example-page --name "Example Page"
npm run dev
```

- [ ] **Step 3: Run full verification**

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```

Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/templates-portfolio-ci.yml README.md
git commit -m "ci: verify templates portfolio"
```

---

## Final Verification Checklist

- [ ] `templates/*/template.json` validates against the canonical metadata rules.
- [ ] Dashboard discovers multiple template entries without hard-coded imports.
- [ ] Category, status, and commercial-readiness filters work.
- [ ] Template detail route renders known entries and 404s unknown slugs.
- [ ] Intake creates all six template areas plus metadata/source records.
- [ ] Dembrandt failure preserves artifacts and a retryable record.
- [ ] Completed templates cannot be overwritten without `--force` and history preservation.
- [ ] Existing `/clone-website` single-page workflow still works when portfolio fields are unused.
- [ ] Vigil benchmark is internal-only and begins at `captured`.
- [ ] Unit/component tests pass.
- [ ] ESLint passes.
- [ ] Next.js production build passes.
- [ ] Playwright desktop and mobile smoke tests pass.
- [ ] CI does not crawl HorizonX or any third-party site automatically.

## Spec Coverage Self-Review

- Master repository and per-template isolation: Tasks 2, 7.
- Dembrandt-before-cloner intake: Tasks 5, 6.
- Canonical metadata/status tracking: Tasks 1, 5, 7.
- Internal dashboard and filters: Tasks 3, 4.
- Error handling and blocked/retry behavior: Task 5.
- QA and responsive checks: Tasks 6, 8.
- Commercialization boundary: Tasks 1, 4, 6, 7, 9.
- HorizonX/Vigil benchmark: Task 7.
- Build/lint/test/CI requirements: Tasks 3, 8, 9.

No spec requirement is intentionally deferred except the explicitly excluded Phase 1 marketplace, checkout, customer-account, and storefront features.