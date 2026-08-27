import { promises as fs } from "node:fs";
import path from "node:path";
import { validateTemplateMetadata } from "@/lib/template-schema";
import type { TemplateMetadata } from "@/types/template";

export async function discoverTemplates(
  rootDir = path.join(process.cwd(), "templates"),
): Promise<TemplateMetadata[]> {
  let entries;
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const templates = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const file = path.join(rootDir, entry.name, "template.json");
        const raw = await fs.readFile(file, "utf8");
        return validateTemplateMetadata(JSON.parse(raw));
      }),
  );

  return templates.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTemplateBySlug(
  slug: string,
  rootDir = path.join(process.cwd(), "templates"),
): Promise<TemplateMetadata | null> {
  const templates = await discoverTemplates(rootDir);
  return templates.find((template) => template.id === slug) ?? null;
}
