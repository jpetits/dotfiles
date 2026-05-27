import Anthropic from "@anthropic-ai/sdk";
import { PostmanClient } from "./client.js";
import { tools } from "./tools.js";
import * as readline from "readline";

const apiKey = process.env.POSTMAN_API_KEY;
if (!apiKey) throw new Error("POSTMAN_API_KEY env var required");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const postman = new PostmanClient(apiKey);

type Input = Record<string, string | boolean | unknown[] | unknown>;

async function handleTool(name: string, input: Input): Promise<unknown> {
  switch (name) {
    case "get_me": return postman.getMe();
    case "get_workspaces": return postman.getWorkspaces();
    case "get_workspace": return postman.getWorkspace(input.id as string);
    case "create_workspace": return postman.createWorkspace({ workspace: input });
    case "delete_workspace": return postman.deleteWorkspace(input.id as string);
    case "get_collections": return postman.getCollections(input.workspaceId as string | undefined);
    case "get_collection": return postman.getCollection(input.id as string);
    case "create_collection": return postman.createCollection({ collection: { info: { name: input.name, description: input.description, schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" } } }, input.workspaceId as string | undefined);
    case "patch_collection": return postman.patchCollection(input.id as string, { collection: { info: { name: input.name, description: input.description } } });
    case "delete_collection": return postman.deleteCollection(input.id as string);
    case "fork_collection": return postman.forkCollection(input.id as string, { label: input.label }, input.workspaceId as string);
    case "get_collection_request": return postman.getCollectionRequest(input.collectionId as string, input.requestId as string);
    case "create_collection_request": return postman.createCollectionRequest(input.collectionId as string, { name: input.name, method: input.method, url: input.url, description: input.description, header: input.headers, body: input.body }, input.folderId as string | undefined);
    case "delete_collection_request": return postman.deleteCollectionRequest(input.collectionId as string, input.requestId as string);
    case "create_collection_folder": return postman.createCollectionFolder(input.collectionId as string, { name: input.name, description: input.description });
    case "delete_collection_folder": return postman.deleteCollectionFolder(input.collectionId as string, input.folderId as string);
    case "get_environments": return postman.getEnvironments(input.workspaceId as string | undefined);
    case "get_environment": return postman.getEnvironment(input.id as string);
    case "create_environment": return postman.createEnvironment({ environment: { name: input.name, values: input.values ?? [] } }, input.workspaceId as string | undefined);
    case "update_environment": return postman.updateEnvironment(input.id as string, { environment: { name: input.name, values: input.values } });
    case "delete_environment": return postman.deleteEnvironment(input.id as string);
    case "get_mocks": return postman.getMocks(input.workspaceId as string | undefined);
    case "get_mock": return postman.getMock(input.id as string);
    case "create_mock": return postman.createMock({ mock: { collection: { id: input.collectionId }, name: input.name, environment: input.environmentId ? { id: input.environmentId } : undefined } }, input.workspaceId as string | undefined);
    case "delete_mock": return postman.deleteMock(input.id as string);
    case "get_monitors": return postman.getMonitors(input.workspaceId as string | undefined);
    case "get_monitor": return postman.getMonitor(input.id as string);
    case "run_monitor": return postman.runMonitor(input.id as string);
    case "delete_monitor": return postman.deleteMonitor(input.id as string);
    case "get_apis": return postman.getApis(input.workspaceId as string | undefined);
    case "get_api": return postman.getApi(input.id as string);
    case "search": return postman.search(input.query as string);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

async function run(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];

  while (true) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const text = response.content.find((b) => b.type === "text");
      return text?.type === "text" ? text.text : "";
    }

    const toolUseBlocks = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");

    const results = await Promise.all(
      toolUseBlocks.map(async (block) => {
        try {
          const result = await handleTool(block.name, block.input as Input);
          return { type: "tool_result" as const, tool_use_id: block.id, content: JSON.stringify(result) };
        } catch (err) {
          return { type: "tool_result" as const, tool_use_id: block.id, content: `Error: ${err}`, is_error: true };
        }
      })
    );

    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: results });
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = () =>
  rl.question("\nPostman> ", async (input) => {
    if (input === "exit") { rl.close(); return; }
    try {
      console.log("\n" + await run(input));
    } catch (err) {
      console.error("Error:", err);
    }
    prompt();
  });

console.log("Postman Agent — type your request, 'exit' to quit");
prompt();
