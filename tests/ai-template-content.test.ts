import { describe, expect, it } from "vitest";
import { AI_TEMPLATE_CONTENT } from "@/features/ai-template/content";

describe("AI template content", () => {
  it("defines exactly five original narrative chapters", () => {
    expect(AI_TEMPLATE_CONTENT.chapters).toHaveLength(5);
    expect(AI_TEMPLATE_CONTENT.chapters.map((chapter) => chapter.title)).toEqual([
      "The Approach",
      "The Threshold",
      "The Inner Ward",
      "The Keep",
      "The Watch",
    ]);
  });

  it("provides reusable company and CTA content", () => {
    expect(AI_TEMPLATE_CONTENT.companyName.length).toBeGreaterThan(0);
    expect(AI_TEMPLATE_CONTENT.promise.length).toBeGreaterThan(0);
    expect(AI_TEMPLATE_CONTENT.primaryCta.label.length).toBeGreaterThan(0);
    expect(AI_TEMPLATE_CONTENT.primaryCta.href).toMatch(/^#/);
  });
});
