import { getSceneBlueprint } from "./scene";

export function AIScene() {
  const blueprint = getSceneBlueprint("desktop");

  return (
    <div className="ai-scene" aria-hidden="true">
      <canvas
        id="ai-template-canvas"
        data-blueprint={JSON.stringify(blueprint)}
      />
      <div className="ai-scene-fallback" />
    </div>
  );
}
