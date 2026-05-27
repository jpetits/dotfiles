const BASE = "https://api.clerk.com/v1";

export class ClerkClient {
  private headers: Record<string, string>;

  constructor(secretKey: string) {
    this.headers = { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" };
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`Clerk API ${method} ${path}: ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  getUsers(params?: { limit?: number; offset?: number; email_address?: string; username?: string }) {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    if (params?.email_address) q.set("email_address", params.email_address);
    if (params?.username) q.set("username", params.username);
    return this.req("GET", `/users?${q}`);
  }

  getUser(userId: string) { return this.req("GET", `/users/${userId}`); }
  deleteUser(userId: string) { return this.req("DELETE", `/users/${userId}`); }
  banUser(userId: string) { return this.req("POST", `/users/${userId}/ban`); }
  unbanUser(userId: string) { return this.req("POST", `/users/${userId}/unban`); }
  getUserSessions(userId: string) { return this.req("GET", `/users/${userId}/sessions`); }

  getSessions(params?: { limit?: number; status?: string }) {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.status) q.set("status", params.status);
    return this.req("GET", `/sessions?${q}`);
  }

  revokeSession(sessionId: string) { return this.req("POST", `/sessions/${sessionId}/revoke`); }
}
