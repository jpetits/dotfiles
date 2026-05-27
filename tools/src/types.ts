import type Anthropic from "@anthropic-ai/sdk";

export type Args = Record<string, unknown>;

export type Command = {
  run: (args: Args) => Promise<unknown>;
  tool: Anthropic.Tool;
};

export type Registry = Record<string, Command>;
