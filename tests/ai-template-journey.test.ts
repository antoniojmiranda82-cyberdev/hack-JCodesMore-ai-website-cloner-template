import { describe, expect, it } from "vitest";
import { getJourneyState } from "@/features/ai-template/journey";

describe("AI template journey", () => {
  it("clamps scroll progress to the journey bounds", () => {
    expect(getJourneyState(-1).chapterIndex).toBe(0);
    expect(getJourneyState(2).chapterIndex).toBe(4);
  });

  it("maps the midpoint into the third chapter", () => {
    const state = getJourneyState(0.5);
    expect(state.chapterIndex).toBe(2);
    expect(state.chapterProgress).toBeGreaterThanOrEqual(0);
    expect(state.chapterProgress).toBeLessThanOrEqual(1);
  });

  it("returns finite camera values across the full route", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const state = getJourneyState(progress);
      expect(Number.isFinite(state.cameraZ)).toBe(true);
      expect(Number.isFinite(state.cameraY)).toBe(true);
      expect(Number.isFinite(state.lookY)).toBe(true);
    }
  });
});
