import { spawn } from "node:child_process";

export function runDembrandt(url, outputDir, { slow = true } = {}) {
  const args = ["-y", "dembrandt", url, "--save-output", "--design-md", "--dtcg", "--tailwind"];
  if (slow) args.push("--slow");

  return new Promise((resolve, reject) => {
    const child = spawn("npx", args, {
      cwd: outputDir,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Dembrandt exited ${code}`));
    });
  });
}
