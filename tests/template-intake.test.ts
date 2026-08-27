import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertSafeTemplateWrite,
  createInitialMetadata,
  markExtractionFailure,
} from "../scripts/lib/template-metadata.mjs";
import { runIntake } from "../scripts/template-intake.mjs";

const roots: string[] = [];

async function tempRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "templates-portfolio-"));
  roots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => fs.rm(root, { recursive: true, force: true })));
});

describe("template intake metadata", () => {
  it("starts captured", () => {
    const metadata = createInitialMetadata({
      slug: "alpha",
      name: "Alpha",
      url: "https://example.com/alpha",
      categories: ["landing-page"],
      motionLevel: "medium",
    });
    expect(metadata.status).toBe("captured");
  });

  it("refuses to overwrite a completed template without force", () => {
    expect(() => assertSafeTemplateWrite({ status: "complete" }, false)).toThrow(/--force/i);
    expect(() => assertSafeTemplateWrite({ status: "complete" }, true)).not.toThrow();
  });

  it("records extraction failures as retryable captured metadata", () => {
    const metadata = createInitialMetadata({
      slug: "alpha",
      name: "Alpha",
      url: "https://example.com/alpha",
      categories: ["landing-page"],
      motionLevel: "medium",
    });
    expect(markExtractionFailure(metadata, new Error("browser missing"))).toMatchObject({
      status: "captured",
      blockedReason: "browser missing",
    });
  });
});

describe("runIntake", () => {
  it("creates all template areas and marks successful extraction", async () => {
    const rootDir = await tempRoot();
    const metadata = await runIntake(
      {
        slug: "alpha",
        name: "Alpha",
        url: "https://example.com/alpha",
        categories: ["landing-page"],
        motionLevel: "medium",
        force: false,
      },
      { rootDir, runner: async () => undefined },
    );

    expect(metadata.status).toBe("extracted");
    for (const area of ["reference", "design", "app", "assets", "qa"]) {
      expect((await fs.stat(path.join(rootDir, "templates", "alpha", area))).isDirectory()).toBe(true);
    }
  });

  it("preserves artifacts and blocked metadata when extraction fails", async () => {
    const rootDir = await tempRoot();
    await expect(
      runIntake(
        {
          slug: "blocked",
          name: "Blocked",
          url: "https://example.com/blocked",
          categories: ["landing-page"],
          motionLevel: "medium",
          force: false,
        },
        { rootDir, runner: async () => { throw new Error("dembrandt failed"); } },
      ),
    ).rejects.toThrow("dembrandt failed");

    const saved = JSON.parse(
      await fs.readFile(path.join(rootDir, "templates", "blocked", "template.json"), "utf8"),
    );
    expect(saved).toMatchObject({ status: "captured", blockedReason: "dembrandt failed" });
  });
});
