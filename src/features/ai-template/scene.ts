export type SceneQuality = "desktop" | "mobile";

export type SceneStructure = {
  kind: "wall" | "tower" | "arch" | "floor" | "battlement";
  position: [number, number, number];
  scale: [number, number, number];
  rotationY?: number;
};

export type SceneLight = {
  kind: "moon" | "fire";
  position: [number, number, number];
  intensity: number;
};

const structures: SceneStructure[] = [
  { kind: "floor", position: [0, -0.25, -4], scale: [8, 0.5, 30] },
  { kind: "wall", position: [-5, 3, 4], scale: [3, 7, 3] },
  { kind: "wall", position: [5, 3, 4], scale: [3, 7, 3] },
  { kind: "tower", position: [-6.5, 5, 1], scale: [3.6, 10, 3.6] },
  { kind: "tower", position: [6.5, 5, 1], scale: [3.6, 10, 3.6] },
  { kind: "arch", position: [0, 2.7, 1], scale: [7.5, 6, 2.5] },
  { kind: "wall", position: [-6, 2.8, -7], scale: [2.2, 6, 10] },
  { kind: "wall", position: [6, 2.8, -7], scale: [2.2, 6, 10] },
  { kind: "arch", position: [0, 3.1, -11], scale: [8.5, 6.8, 2] },
  { kind: "tower", position: [-7.2, 5.5, -17], scale: [4.2, 11, 4.2] },
  { kind: "tower", position: [7.2, 5.5, -17], scale: [4.2, 11, 4.2] },
  { kind: "wall", position: [-5.5, 3.2, -22], scale: [2.4, 6.5, 9] },
  { kind: "wall", position: [5.5, 3.2, -22], scale: [2.4, 6.5, 9] },
  { kind: "battlement", position: [0, 7.8, -25], scale: [10, 1.2, 3] },
  { kind: "arch", position: [0, 3.8, -29], scale: [9, 8, 3] },
  { kind: "tower", position: [-7.8, 6.5, -34], scale: [4.4, 13, 4.4] },
  { kind: "tower", position: [7.8, 6.5, -34], scale: [4.4, 13, 4.4] },
  { kind: "battlement", position: [0, 9, -38], scale: [14, 1.4, 4] },
];

const lights: SceneLight[] = [
  { kind: "moon", position: [-10, 18, 12], intensity: 2.2 },
  { kind: "fire", position: [-3.3, 2.2, 4], intensity: 18 },
  { kind: "fire", position: [3.3, 2.2, 4], intensity: 18 },
  { kind: "fire", position: [-3.6, 2.1, -12], intensity: 15 },
  { kind: "fire", position: [3.6, 2.1, -12], intensity: 15 },
  { kind: "fire", position: [0, 3, -29], intensity: 12 },
];

export function getSceneBlueprint(quality: SceneQuality) {
  return {
    structures: quality === "mobile" ? structures.filter((_, index) => index % 2 === 0) : structures,
    lights: quality === "mobile" ? lights.slice(0, 4) : lights,
  };
}
