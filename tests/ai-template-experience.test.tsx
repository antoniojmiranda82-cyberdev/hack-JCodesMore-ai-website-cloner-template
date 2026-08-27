import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AITemplateExperience } from "@/features/ai-template/ai-template-experience";

describe("AI template experience", () => {
  it("renders all five chapters and the primary CTA without WebGL", () => {
    render(<AITemplateExperience forceStatic />);

    for (const title of [
      "The Approach",
      "The Threshold",
      "The Inner Ward",
      "The Keep",
      "The Watch",
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }

    expect(screen.getByRole("link", { name: "Enter the platform" })).toBeInTheDocument();
  });
});
