import { describe, expect, it } from "vitest";
import { getSceneBlueprint } from "@/features/ai-template/scene";

describe("AI template scene blueprint", () => {
  it("builds an original architectural path with multiple structures", () => {
    const scene = getSceneBlueprint("desktop");
    expect(scene.structures.length).toBeGreaterThanOrEqual(10);
    expect(scene.lights.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps the moonlight bright enough to reveal architecture", () => {
    const scene = getSceneBlueprint("desktop");
    const moon = scene.lights.find((light) => light.kind === "moon");
    expect(moon?.intensity).toBeGreaterThanOrEqual(3.2);
  });

  it("reduces scene density for mobile", () => {
    const desktop = getSceneBlueprint("desktop");
    const mobile = getSceneBlueprint("mobile");
    expect(mobile.structures.length).toBeLessThan(desktop.structures.length);
  });
});
