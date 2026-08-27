export function createInitialMetadata({ slug, name, url, categories, motionLevel }) {
  return {
    id: slug,
    name,
    sourceUrl: url,
    category: categories,
    stack: ["nextjs", "react", "tailwind"],
    motionLevel,
    status: "captured",
    commercialReady: false,
    sourceBrandRemoved: false,
    qaPassed: false,
  };
}

export function assertSafeTemplateWrite(existing, force) {
  if (existing?.status === "complete" && !force) {
    throw new Error("Refusing to overwrite completed template without --force");
  }
}

export function markExtractionFailure(metadata, error) {
  return {
    ...metadata,
    status: "captured",
    blockedReason: error instanceof Error ? error.message : String(error),
  };
}
