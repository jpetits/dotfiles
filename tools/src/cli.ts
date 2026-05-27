#!/usr/bin/env tsx
import { readFileSync } from "fs";
import { join } from "path";

try {
  const lines = readFileSync(join(import.meta.dirname, "../.env"), "utf8").split("\n");
  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
} catch {}

import { createPostmanRegistry } from "./postman-service.js";
import { createNeonRegistry } from "./neon-service.js";
import { createClerkRegistry } from "./clerk-service.js";
import type { Registry } from "./types.js";

const registry: Registry = {
  ...(process.env.POSTMAN_API_KEY ? createPostmanRegistry(process.env.POSTMAN_API_KEY) : {}),
  ...(process.env.NEON_API_KEY ? createNeonRegistry(process.env.NEON_API_KEY) : {}),
  ...(process.env.CLERK_SECRET_KEY ? createClerkRegistry(process.env.CLERK_SECRET_KEY) : {}),
};

const [tool, ...rawArgs] = process.argv.slice(2);
const args: Record<string, string> = {};
for (let i = 0; i < rawArgs.length; i += 2) {
  args[rawArgs[i].replace(/^--/, "")] = rawArgs[i + 1];
}

async function main() {
  const cmd = registry[tool];
  if (!cmd) {
    console.error(`Unknown tool: ${tool}\nAvailable: ${Object.keys(registry).join(", ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify(await cmd.run(args), null, 2));
}

main().catch((err) => { console.error(err.message); process.exit(1); });
