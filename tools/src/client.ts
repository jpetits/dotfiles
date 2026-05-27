const BASE = "https://api.getpostman.com";

export class PostmanClient {
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.headers = { "x-api-key": apiKey, "Content-Type": "application/json" };
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`Postman API ${method} ${path}: ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  // Auth
  getMe() { return this.req("GET", "/me"); }

  // Workspaces
  getWorkspaces() { return this.req("GET", "/workspaces"); }
  getWorkspace(id: string) { return this.req("GET", `/workspaces/${id}`); }
  createWorkspace(body: unknown) { return this.req("POST", "/workspaces", body); }
  updateWorkspace(id: string, body: unknown) { return this.req("PUT", `/workspaces/${id}`, body); }
  deleteWorkspace(id: string) { return this.req("DELETE", `/workspaces/${id}`); }

  // Collections
  getCollections(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("GET", `/collections${q}`);
  }
  getCollection(id: string) { return this.req("GET", `/collections/${id}`); }
  createCollection(body: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("POST", `/collections${q}`, body);
  }
  updateCollection(id: string, body: unknown) { return this.req("PUT", `/collections/${id}`, body); }
  patchCollection(id: string, body: unknown) { return this.req("PATCH", `/collections/${id}`, body); }
  deleteCollection(id: string) { return this.req("DELETE", `/collections/${id}`); }
  forkCollection(id: string, body: unknown, workspaceId: string) {
    return this.req("POST", `/collections/fork/${id}?workspace=${workspaceId}`, body);
  }

  // Collection folders
  getCollectionFolder(collectionId: string, folderId: string) {
    return this.req("GET", `/collections/${collectionId}/folders/${folderId}`);
  }
  createCollectionFolder(collectionId: string, body: unknown) {
    return this.req("POST", `/collections/${collectionId}/folders`, body);
  }
  updateCollectionFolder(collectionId: string, folderId: string, body: unknown) {
    return this.req("PUT", `/collections/${collectionId}/folders/${folderId}`, body);
  }
  deleteCollectionFolder(collectionId: string, folderId: string) {
    return this.req("DELETE", `/collections/${collectionId}/folders/${folderId}`);
  }

  // Collection requests
  getCollectionRequest(collectionId: string, requestId: string) {
    return this.req("GET", `/collections/${collectionId}/requests/${requestId}`);
  }
  createCollectionRequest(collectionId: string, body: unknown, folderId?: string) {
    const q = folderId ? `?folder=${folderId}` : "";
    return this.req("POST", `/collections/${collectionId}/requests${q}`, body);
  }
  updateCollectionRequest(collectionId: string, requestId: string, body: unknown) {
    return this.req("PUT", `/collections/${collectionId}/requests/${requestId}`, body);
  }
  deleteCollectionRequest(collectionId: string, requestId: string) {
    return this.req("DELETE", `/collections/${collectionId}/requests/${requestId}`);
  }

  // Environments
  getEnvironments(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("GET", `/environments${q}`);
  }
  getEnvironment(id: string) { return this.req("GET", `/environments/${id}`); }
  createEnvironment(body: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("POST", `/environments${q}`, body);
  }
  updateEnvironment(id: string, body: unknown) { return this.req("PUT", `/environments/${id}`, body); }
  deleteEnvironment(id: string) { return this.req("DELETE", `/environments/${id}`); }

  // Mocks
  getMocks(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("GET", `/mocks${q}`);
  }
  getMock(id: string) { return this.req("GET", `/mocks/${id}`); }
  createMock(body: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("POST", `/mocks${q}`, body);
  }
  updateMock(id: string, body: unknown) { return this.req("PUT", `/mocks/${id}`, body); }
  deleteMock(id: string) { return this.req("DELETE", `/mocks/${id}`); }

  // Monitors
  getMonitors(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("GET", `/monitors${q}`);
  }
  getMonitor(id: string) { return this.req("GET", `/monitors/${id}`); }
  createMonitor(body: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("POST", `/monitors${q}`, body);
  }
  updateMonitor(id: string, body: unknown) { return this.req("PUT", `/monitors/${id}`, body); }
  deleteMonitor(id: string) { return this.req("DELETE", `/monitors/${id}`); }
  runMonitor(id: string) { return this.req("POST", `/monitors/${id}/run`); }

  // APIs / Specs
  getApis(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("GET", `/apis${q}`);
  }
  getApi(id: string) { return this.req("GET", `/apis/${id}`); }
  createApi(body: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${workspaceId}` : "";
    return this.req("POST", `/apis${q}`, body);
  }
  updateApi(id: string, body: unknown) { return this.req("PUT", `/apis/${id}`, body); }
  deleteApi(id: string) { return this.req("DELETE", `/apis/${id}`); }

  // Search
  search(query: string) { return this.req("GET", `/search/searchTerm?q=${encodeURIComponent(query)}`); }
}
