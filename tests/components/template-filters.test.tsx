import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TemplateFilters } from "@/components/templates/template-filters";

const templates = [
  {
    id: "cine",
    name: "Cinematic One",
    sourceUrl: "https://example.com/cine",
    category: ["cinematic"],
    stack: ["nextjs"],
    motionLevel: "high" as const,
    status: "captured" as const,
    commercialReady: false,
    sourceBrandRemoved: false,
    qaPassed: false,
  },
  {
    id: "saas",
    name: "SaaS One",
    sourceUrl: "https://example.com/saas",
    category: ["saas"],
    stack: ["nextjs"],
    motionLevel: "medium" as const,
    status: "qa" as const,
    commercialReady: false,
    sourceBrandRemoved: false,
    qaPassed: false,
  },
];

describe("TemplateFilters", () => {
  it("filters by category", () => {
    render(<TemplateFilters templates={templates} />);
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "cinematic" } });
    expect(screen.getByText("Cinematic One")).toBeInTheDocument();
    expect(screen.queryByText("SaaS One")).not.toBeInTheDocument();
  });
});
