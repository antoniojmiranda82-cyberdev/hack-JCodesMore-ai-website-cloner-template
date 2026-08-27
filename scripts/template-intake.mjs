import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertSafeTemplateWrite,
  createInitialMetadata,
  markExtractionFailure,
} from "./lib/template-metadata.mjs";
import { runDembrandt } from "./lib/run-dembrandt.mjs";

function getFlag(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

export function parseArgs(args) {
  const url = getFlag(args, "--url");
  const slug = getFlag(args, "--slug");
  const name = getFlag(args, "--name");
  const categoryValue = getFlag(args, "--category") ?? "landing-page";
  const motionLevel = getFlag(args, "--motion") ?? "medium";
  const force = args.includes("--force");

  if (!url || !slug || !name) {
    throw new Error("Required flags: --url <url> --slug <slug> --name <name>");
  }

  return {
    url,
    slug,
    name,
    categories: categoryValue.split(",").map((value) => value.trim()).filter(Boolean),
    motionLevel,
    force,
  };
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function writeJsonAtomic(file, value) {
  const tempFile = `${file}.tmp`;
  await fs.writeFile(tempFile, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(tempFile, file);
}

function historyTimestamp() {
  return new Date().toISOString().replaceAll(":", "-");
}

export async function runIntake(options, { rootDir = process.cwd(), runner = runDembrandt } = {}) {
  const templateDir = path.join(rootDir, "templates", options.slug);
  const metadataFile = path.join(templateDir, "template.json");
  const existing = await readJson(metadataFile);
  assertSafeTemplateWrite(existing, options.force);

  if (existing && options.force) {
    const historyDir = path.join(templateDir, "template-history");
    await fs.mkdir(historyDir, { recursive: true });
    await writeJsonAtomic(path.join(historyDir, `${historyTimestamp()}.json`), existing);
  }

  const referenceDir = path.join(templateDir, "reference");
  const designDir = path.join(templateDir, "design");
  const appDir = path.join(templateDir, "app");
  const assetsDir = path.join(templateDir, "assets");
  const qaDir = path.join(templateDir, "qa");

  await Promise.all(
    [referenceDir, designDir, appDir, assetsDir, qaDir].map((dir) =>
      fs.mkdir(dir, { recursive: true }),
    ),
  );

  const metadata = createInitialMetadata(options);
  await writeJsonAtomic(metadataFile, metadata);
  await writeJsonAtomic(path.join(referenceDir, "source.json"), {
    url: options.url,
    capturedAt: new Date().toISOString(),
  });

  try {
    await runner(options.url, designDir);
    const extracted = { ...metadata, status: "extracted" };
    await writeJsonAtomic(metadataFile, extracted);
    return extracted;
  } catch (error) {
    const blocked = markExtractionFailure(metadata, error);
    await writeJsonAtomic(metadataFile, blocked);
    throw error;
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const options = parseArgs(process.argv.slice(2));
    await runIntake(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
