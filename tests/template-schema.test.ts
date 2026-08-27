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
