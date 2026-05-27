import { NeonClient } from "./neon.js";
import type { Args, Registry } from "./types.js";
import type Anthropic from "@anthropic-ai/sdk";

function cmd(
  tool: Omit<Anthropic.Tool, "input_schema"> & { input_schema: Anthropic.Tool["input_schema"] },
  run: (args: Args) => Promise<unknown>
): { run: (args: Args) => Promise<unknown>; tool: Anthropic.Tool } {
  return { run, tool: tool as Anthropic.Tool };
}

export function createNeonRegistry(apiKey: string): Registry {
  const c = new NeonClient(apiKey);

  return {
    neon_get_me: cmd(
      { name: "neon_get_me", description: "Get authenticated Neon user info", input_schema: { type: "object", properties: {} } },
      () => c.getMe()
    ),
    neon_get_projects: cmd(
      { name: "neon_get_projects", description: "List all Neon projects", input_schema: { type: "object", properties: {} } },
      () => c.getProjects()
    ),
    neon_get_project: cmd(
      { name: "neon_get_project", description: "Get a specific Neon project by ID", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getProject(a.id as string)
    ),
    neon_get_branches: cmd(
      { name: "neon_get_branches", description: "List all branches for a project", input_schema: { type: "object", properties: { projectId: { type: "string" } }, required: ["projectId"] } },
      (a) => c.getBranches(a.projectId as string)
    ),
    neon_get_branch: cmd(
      { name: "neon_get_branch", description: "Get a specific branch", input_schema: { type: "object", properties: { projectId: { type: "string" }, branchId: { type: "string" } }, required: ["projectId", "branchId"] } },
      (a) => c.getBranch(a.projectId as string, a.branchId as string)
    ),
    neon_get_endpoints: cmd(
      { name: "neon_get_endpoints", description: "List compute endpoints for a project", input_schema: { type: "object", properties: { projectId: { type: "string" } }, required: ["projectId"] } },
      (a) => c.getEndpoints(a.projectId as string)
    ),
    neon_get_connection_uri: cmd(
      { name: "neon_get_connection_uri", description: "Get a connection URI for a project branch", input_schema: { type: "object", properties: { projectId: { type: "string" }, database: { type: "string" }, role: { type: "string" }, branchId: { type: "string" } }, required: ["projectId"] } },
      (a) => c.getConnectionUri(a.projectId as string, (a.database as string) ?? "neondb", (a.role as string) ?? "neondb_owner", a.branchId as string | undefined)
    ),
    neon_run_query: cmd(
      { name: "neon_run_query", description: "Execute a SQL query against a Neon database", input_schema: { type: "object", properties: { projectId: { type: "string" }, query: { type: "string" }, database: { type: "string" }, branchId: { type: "string" } }, required: ["projectId", "query"] } },
      (a) => c.runQuery(a.projectId as string, a.query as string, (a.database as string) ?? "neondb", (a.role as string) ?? "neondb_owner", a.branchId as string | undefined)
    ),
  };
}
