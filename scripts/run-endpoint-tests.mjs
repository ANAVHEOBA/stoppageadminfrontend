import { build } from "esbuild";
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const rootDirectory = path.resolve(path.dirname(currentFilePath), "..");
const tempDirectory = path.join(rootDirectory, ".tmp", "tests");
const entryFile = path.join(rootDirectory, "tests", "admin-endpoints.test.ts");
const outputFile = path.join(tempDirectory, "admin-endpoints.test.mjs");

await rm(tempDirectory, { force: true, recursive: true });
await mkdir(tempDirectory, { recursive: true });

await build({
  alias: {
    "~": path.join(rootDirectory, "src"),
  },
  bundle: true,
  entryPoints: [entryFile],
  format: "esm",
  outfile: outputFile,
  platform: "node",
  sourcemap: "inline",
  target: "node22",
});

const exitCode = await runNodeTest(outputFile);

if (exitCode !== 0) {
  process.exit(exitCode);
}

async function runNodeTest(testFilePath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [testFilePath], {
      cwd: rootDirectory,
      stdio: "inherit",
    });

    child.once("error", reject);
    child.once("exit", code => resolve(code ?? 1));
  });
}
