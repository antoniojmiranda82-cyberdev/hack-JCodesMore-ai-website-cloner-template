export const TEMPLATE_STATUSES = [
  "captured",
  "extracted",
  "rebuilding",
  "qa",
  "complete",
  "ready-to-commercialize",
] as const;

export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];
export type MotionLevel = "low" | "medium" | "high";

export interface TemplateMetadata {
  id: string;
  name: string;
  sourceUrl: string;
  category: string[];
  stack: string[];
  motionLevel: MotionLevel;
  status: TemplateStatus;
  commercialReady: boolean;
  sourceBrandRemoved: boolean;
  qaPassed: boolean;
  previewImage?: string;
  blockedReason?: string;
}
