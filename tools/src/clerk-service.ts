import type Anthropic from "@anthropic-ai/sdk";
import { ClerkClient } from "./clerk.js";
import type { Args, Registry } from "./types.js";

function cmd(
  tool: Omit<Anthropic.Tool, "input_schema"> & { input_schema: Anthropic.Tool["input_schema"] },
  run: (args: Args) => Promise<unknown>
): { run: (args: Args) => Promise<unknown>; tool: Anthropic.Tool } {
  return { run, tool: tool as Anthropic.Tool };
}

export function createClerkRegistry(secretKey: string): Registry {
  const c = new ClerkClient(secretKey);

  return {
    clerk_get_users: cmd(
      { name: "clerk_get_users", description: "List Clerk users, optionally filter by email or username", input_schema: { type: "object", properties: { limit: { type: "number" }, offset: { type: "number" }, email_address: { type: "string" }, username: { type: "string" } } } },
      (a) => c.getUsers({ limit: a.limit as number, offset: a.offset as number, email_address: a.email_address as string, username: a.username as string })
    ),
    clerk_get_user: cmd(
      { name: "clerk_get_user", description: "Get a specific Clerk user by ID", input_schema: { type: "object", properties: { userId: { type: "string" } }, required: ["userId"] } },
      (a) => c.getUser(a.userId as string)
    ),
    clerk_delete_user: cmd(
      { name: "clerk_delete_user", description: "Delete a Clerk user", input_schema: { type: "object", properties: { userId: { type: "string" } }, required: ["userId"] } },
      (a) => c.deleteUser(a.userId as string)
    ),
    clerk_ban_user: cmd(
      { name: "clerk_ban_user", description: "Ban a Clerk user", input_schema: { type: "object", properties: { userId: { type: "string" } }, required: ["userId"] } },
      (a) => c.banUser(a.userId as string)
    ),
    clerk_unban_user: cmd(
      { name: "clerk_unban_user", description: "Unban a Clerk user", input_schema: { type: "object", properties: { userId: { type: "string" } }, required: ["userId"] } },
      (a) => c.unbanUser(a.userId as string)
    ),
    clerk_get_user_sessions: cmd(
      { name: "clerk_get_user_sessions", description: "Get active sessions for a Clerk user", input_schema: { type: "object", properties: { userId: { type: "string" } }, required: ["userId"] } },
      (a) => c.getUserSessions(a.userId as string)
    ),
    clerk_get_sessions: cmd(
      { name: "clerk_get_sessions", description: "List Clerk sessions, optionally filter by status", input_schema: { type: "object", properties: { limit: { type: "number" }, status: { type: "string", enum: ["active", "revoked", "ended", "expired", "removed", "abandoned"] } } } },
      (a) => c.getSessions({ limit: a.limit as number, status: a.status as string })
    ),
    clerk_revoke_session: cmd(
      { name: "clerk_revoke_session", description: "Revoke a Clerk session", input_schema: { type: "object", properties: { sessionId: { type: "string" } }, required: ["sessionId"] } },
      (a) => c.revokeSession(a.sessionId as string)
    ),
  };
}
