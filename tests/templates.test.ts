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
