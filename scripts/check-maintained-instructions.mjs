import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const instructions = readFileSync(resolve(root, "AGENTS.md"), "utf8");
const sections = ["Architecture", "MCP Tools", "Constants"];
const paths = new Set();
for (const section of sections) {
  const text = instructions.split(`## ${section}`)[1]?.split(/\n## /)[0] ?? "";
  for (const [, path] of text.matchAll(/`([^`]+)`/g))
    if (/^(?:app|components|hooks|lib|providers|types)\//.test(path)) paths.add(path);
}
if (!paths.size) throw new Error("No maintained architecture paths found in AGENTS.md");
const missing = [...paths].filter(path => !existsSync(resolve(root, path)));
if (missing.length) throw new Error(`Stale AGENTS.md paths: ${missing.join(", ")}`);
console.log(`Verified ${paths.size} maintained App instruction paths`);
