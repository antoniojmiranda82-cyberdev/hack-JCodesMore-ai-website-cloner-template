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
    expect(screen.getByText("Motion: high")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source reference" })).toHaveAttribute("href", template.sourceUrl);
  });
});
