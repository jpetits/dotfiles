const BASE = "https://console.neon.tech/api/v2";

export class NeonClient {
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`Neon API ${method} ${path}: ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  getMe() { return this.req("GET", "/users/me"); }

  getProjects() { return this.req("GET", "/projects"); }
  getProject(id: string) { return this.req("GET", `/projects/${id}`); }

  getBranches(projectId: string) { return this.req("GET", `/projects/${projectId}/branches`); }
  getBranch(projectId: string, branchId: string) { return this.req("GET", `/projects/${projectId}/branches/${branchId}`); }

  getEndpoints(projectId: string) { return this.req("GET", `/projects/${projectId}/endpoints`); }

  getConnectionUri(projectId: string, databaseName: string, roleName: string, branchId?: string) {
    const q = new URLSearchParams({ database_name: databaseName, role_name: roleName });
    if (branchId) q.set("branch_id", branchId);
    return this.req("GET", `/projects/${projectId}/connection_uri?${q}`);
  }

  async runQuery(projectId: string, query: string, databaseName: string, role: string, branchId?: string) {
    const branch = branchId ?? await this.getMainBranchId(projectId);
    return this.req("POST", `/projects/${projectId}/query`, { query, db_name: databaseName, role_name: role, branch_id: branch });
  }

  private async getMainBranchId(projectId: string): Promise<string> {
    const res = await this.getBranches(projectId) as { branches: { id: string; default: boolean }[] };
    const main = res.branches.find((b) => b.default) ?? res.branches[0];
    if (!main) throw new Error(`No branches found for project ${projectId}`);
    return main.id;
  }
}
