import Anthropic from "@anthropic-ai/sdk";
import { createPostmanRegistry } from "./postman-service.js";
import type { Registry } from "./types.js";
import * as readline from "readline";

const apiKey = process.env.POSTMAN_API_KEY;
if (!apiKey) throw new Error("POSTMAN_API_KEY env var required");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const registry: Registry = {
  ...createPostmanRegistry(apiKey),
};

const tools = Object.values(registry).map((c) => c.tool);

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
        const cmd = registry[block.name];
        try {
          const result = cmd
            ? await cmd.run(block.input as Record<string, unknown>)
            : (() => { throw new Error(`Unknown tool: ${block.name}`); })();
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
