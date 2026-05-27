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

import { PostmanClient } from "./client.js";

const apiKey = process.env.POSTMAN_API_KEY;
if (!apiKey) throw new Error("POSTMAN_API_KEY env var required");

const postman = new PostmanClient(apiKey);
const [tool, ...rawArgs] = process.argv.slice(2);

const args: Record<string, string> = {};
for (let i = 0; i < rawArgs.length; i += 2) {
  args[rawArgs[i].replace(/^--/, "")] = rawArgs[i + 1];
}

async function main() {
  let result: unknown;

  switch (tool) {
    case "get_me": result = await postman.getMe(); break;
    case "get_workspaces": result = await postman.getWorkspaces(); break;
    case "get_workspace": result = await postman.getWorkspace(args.id); break;
    case "create_workspace": result = await postman.createWorkspace({ workspace: args }); break;
    case "delete_workspace": result = await postman.deleteWorkspace(args.id); break;
    case "get_collections": result = await postman.getCollections(args.workspaceId); break;
    case "get_collection": result = await postman.getCollection(args.id); break;
    case "create_collection": result = await postman.createCollection({ collection: { info: { name: args.name, description: args.description, schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" } } }, args.workspaceId); break;
    case "patch_collection": result = await postman.patchCollection(args.id, { collection: { info: { name: args.name, description: args.description } } }); break;
    case "delete_collection": result = await postman.deleteCollection(args.id); break;
    case "get_collection_request": result = await postman.getCollectionRequest(args.collectionId, args.requestId); break;
    case "delete_collection_request": result = await postman.deleteCollectionRequest(args.collectionId, args.requestId); break;
    case "get_environments": result = await postman.getEnvironments(args.workspaceId); break;
    case "get_environment": result = await postman.getEnvironment(args.id); break;
    case "create_environment": result = await postman.createEnvironment({ environment: { name: args.name, values: args.values ? JSON.parse(args.values) : [] } }, args.workspaceId); break;
    case "update_environment": result = await postman.updateEnvironment(args.id, { environment: { name: args.name, values: args.values ? JSON.parse(args.values) : undefined } }); break;
    case "delete_environment": result = await postman.deleteEnvironment(args.id); break;
    case "get_mocks": result = await postman.getMocks(args.workspaceId); break;
    case "get_mock": result = await postman.getMock(args.id); break;
    case "create_mock": result = await postman.createMock({ mock: { collection: { id: args.collectionId }, name: args.name } }, args.workspaceId); break;
    case "delete_mock": result = await postman.deleteMock(args.id); break;
    case "get_monitors": result = await postman.getMonitors(args.workspaceId); break;
    case "get_monitor": result = await postman.getMonitor(args.id); break;
    case "run_monitor": result = await postman.runMonitor(args.id); break;
    case "delete_monitor": result = await postman.deleteMonitor(args.id); break;
    case "get_apis": result = await postman.getApis(args.workspaceId); break;
    case "get_api": result = await postman.getApi(args.id); break;
    case "search": result = await postman.search(args.query); break;
    default:
      console.error(`Unknown tool: ${tool}`);
      process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => { console.error(err.message); process.exit(1); });
