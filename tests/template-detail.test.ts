import path from "node:path";
import { describe, expect, it } from "vitest";
import { getTemplateBySlug } from "@/lib/templates";

const root = path.join(process.cwd(), "tests/fixtures/templates");

describe("template detail data", () => {
  it("returns all fields needed by the detail view", async () => {
    const template = await getTemplateBySlug("alpha", root);
    expect(template).toMatchObject({
      id: "alpha",
      name: "Alpha",
      sourceUrl: "https://example.com/alpha",
      category: ["cinematic"],
      stack: ["nextjs", "react"],
      motionLevel: "high",
      status: "captured",
      commercialReady: false,
      sourceBrandRemoved: false,
      qaPassed: false,
    });
  });

  it("returns null for an invalid slug", async () => {
    expect(await getTemplateBySlug("does-not-exist", root)).toBeNull();
  });
});
