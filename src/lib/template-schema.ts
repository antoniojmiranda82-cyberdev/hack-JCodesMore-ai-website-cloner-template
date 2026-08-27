import {
  TEMPLATE_STATUSES,
  type MotionLevel,
  type TemplateMetadata,
  type TemplateStatus,
} from "@/types/template";

const motionLevels: MotionLevel[] = ["low", "medium", "high"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateTemplateMetadata(input: unknown): TemplateMetadata {
  if (!input || typeof input !== "object") {
    throw new Error("Template metadata must be an object");
  }

  const value = input as Record<string, unknown>;

  for (const field of ["id", "name", "sourceUrl"] as const) {
    if (typeof value[field] !== "string" || value[field].length === 0) {
      throw new Error(`${field} must be a non-empty string`);
    }
  }

  if (!isStringArray(value.category) || !value.category.length) {
    throw new Error("category must be a non-empty string array");
  }

  if (!isStringArray(value.stack) || !value.stack.length) {
    throw new Error("stack must be a non-empty string array");
  }

  if (!motionLevels.includes(value.motionLevel as MotionLevel)) {
    throw new Error("motionLevel is invalid");
  }

  if (!TEMPLATE_STATUSES.includes(value.status as TemplateStatus)) {
    throw new Error("status is invalid");
  }

  for (const field of ["commercialReady", "sourceBrandRemoved", "qaPassed"] as const) {
    if (typeof value[field] !== "boolean") {
      throw new Error(`${field} must be boolean`);
    }
  }

  if (
    value.status === "ready-to-commercialize" &&
    (!value.commercialReady || !value.sourceBrandRemoved || !value.qaPassed)
  ) {
    throw new Error("commercial readiness requires branding removal and QA pass");
  }

  return value as unknown as TemplateMetadata;
}
