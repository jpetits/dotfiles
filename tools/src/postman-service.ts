import type Anthropic from "@anthropic-ai/sdk";
import { PostmanClient } from "./client.js";
import type { Args, Registry } from "./types.js";

function cmd(
  tool: Omit<Anthropic.Tool, "input_schema"> & { input_schema: Anthropic.Tool["input_schema"] },
  run: (args: Args) => Promise<unknown>
): { run: (args: Args) => Promise<unknown>; tool: Anthropic.Tool } {
  return { run, tool: tool as Anthropic.Tool };
}

export function createPostmanRegistry(apiKey: string): Registry {
  const c = new PostmanClient(apiKey);

  return {
    get_me: cmd(
      { name: "get_me", description: "Get authenticated Postman user info", input_schema: { type: "object", properties: {} } },
      () => c.getMe()
    ),

    // Workspaces
    get_workspaces: cmd(
      { name: "get_workspaces", description: "List all Postman workspaces", input_schema: { type: "object", properties: {} } },
      () => c.getWorkspaces()
    ),
    get_workspace: cmd(
      { name: "get_workspace", description: "Get a specific workspace by ID", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getWorkspace(a.id as string)
    ),
    create_workspace: cmd(
      { name: "create_workspace", description: "Create a new Postman workspace", input_schema: { type: "object", properties: { name: { type: "string" }, type: { type: "string", enum: ["personal", "team", "private", "public"] }, description: { type: "string" } }, required: ["name", "type"] } },
      (a) => c.createWorkspace({ workspace: a })
    ),
    delete_workspace: cmd(
      { name: "delete_workspace", description: "Delete a workspace", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.deleteWorkspace(a.id as string)
    ),

    // Collections
    get_collections: cmd(
      { name: "get_collections", description: "List all collections, optionally filtered by workspace", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
      (a) => c.getCollections(a.workspaceId as string | undefined)
    ),
    get_collection: cmd(
      { name: "get_collection", description: "Get a collection with all its requests and folders", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getCollection(a.id as string)
    ),
    create_collection: cmd(
      { name: "create_collection", description: "Create a new collection", input_schema: { type: "object", properties: { name: { type: "string" }, workspaceId: { type: "string" }, description: { type: "string" } }, required: ["name"] } },
      (a) => c.createCollection({ collection: { info: { name: a.name, description: a.description, schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" } } }, a.workspaceId as string | undefined)
    ),
    patch_collection: cmd(
      { name: "patch_collection", description: "Update collection name/description", input_schema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" } }, required: ["id"] } },
      (a) => c.patchCollection(a.id as string, { collection: { info: { name: a.name, description: a.description } } })
    ),
    delete_collection: cmd(
      { name: "delete_collection", description: "Delete a collection", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.deleteCollection(a.id as string)
    ),
    fork_collection: cmd(
      { name: "fork_collection", description: "Fork a collection into a workspace", input_schema: { type: "object", properties: { id: { type: "string" }, label: { type: "string" }, workspaceId: { type: "string" } }, required: ["id", "label", "workspaceId"] } },
      (a) => c.forkCollection(a.id as string, { label: a.label }, a.workspaceId as string)
    ),

    // Collection requests
    get_collection_request: cmd(
      { name: "get_collection_request", description: "Get a specific request from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, requestId: { type: "string" } }, required: ["collectionId", "requestId"] } },
      (a) => c.getCollectionRequest(a.collectionId as string, a.requestId as string)
    ),
    create_collection_request: cmd(
      { name: "create_collection_request", description: "Add a request to a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, folderId: { type: "string" }, name: { type: "string" }, method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] }, url: { type: "string" }, description: { type: "string" }, headers: { type: "array", items: { type: "object" } }, body: { type: "object" } }, required: ["collectionId", "name", "method", "url"] } },
      (a) => c.createCollectionRequest(a.collectionId as string, { name: a.name, method: a.method, url: a.url, description: a.description, header: a.headers, body: a.body }, a.folderId as string | undefined)
    ),
    delete_collection_request: cmd(
      { name: "delete_collection_request", description: "Delete a request from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, requestId: { type: "string" } }, required: ["collectionId", "requestId"] } },
      (a) => c.deleteCollectionRequest(a.collectionId as string, a.requestId as string)
    ),

    // Collection folders
    create_collection_folder: cmd(
      { name: "create_collection_folder", description: "Create a folder inside a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, name: { type: "string" }, description: { type: "string" } }, required: ["collectionId", "name"] } },
      (a) => c.createCollectionFolder(a.collectionId as string, { name: a.name, description: a.description })
    ),
    delete_collection_folder: cmd(
      { name: "delete_collection_folder", description: "Delete a folder from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, folderId: { type: "string" } }, required: ["collectionId", "folderId"] } },
      (a) => c.deleteCollectionFolder(a.collectionId as string, a.folderId as string)
    ),

    // Environments
    get_environments: cmd(
      { name: "get_environments", description: "List all environments", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
      (a) => c.getEnvironments(a.workspaceId as string | undefined)
    ),
    get_environment: cmd(
      { name: "get_environment", description: "Get a specific environment with its variables", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getEnvironment(a.id as string)
    ),
    create_environment: cmd(
      { name: "create_environment", description: "Create a new environment with variables", input_schema: { type: "object", properties: { name: { type: "string" }, workspaceId: { type: "string" }, values: { type: "array", items: { type: "object" } } }, required: ["name"] } },
      (a) => c.createEnvironment({ environment: { name: a.name, values: a.values ?? [] } }, a.workspaceId as string | undefined)
    ),
    update_environment: cmd(
      { name: "update_environment", description: "Update an environment's variables", input_schema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, values: { type: "array", items: { type: "object" } } }, required: ["id"] } },
      (a) => c.updateEnvironment(a.id as string, { environment: { name: a.name, values: a.values } })
    ),
    delete_environment: cmd(
      { name: "delete_environment", description: "Delete an environment", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.deleteEnvironment(a.id as string)
    ),

    // Mocks
    get_mocks: cmd(
      { name: "get_mocks", description: "List all mock servers", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
      (a) => c.getMocks(a.workspaceId as string | undefined)
    ),
    get_mock: cmd(
      { name: "get_mock", description: "Get a specific mock server", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getMock(a.id as string)
    ),
    create_mock: cmd(
      { name: "create_mock", description: "Create a mock server from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, name: { type: "string" }, workspaceId: { type: "string" }, environmentId: { type: "string" } }, required: ["collectionId", "name"] } },
      (a) => c.createMock({ mock: { collection: { id: a.collectionId }, name: a.name, environment: a.environmentId ? { id: a.environmentId } : undefined } }, a.workspaceId as string | undefined)
    ),
    delete_mock: cmd(
      { name: "delete_mock", description: "Delete a mock server", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.deleteMock(a.id as string)
    ),

    // Monitors
    get_monitors: cmd(
      { name: "get_monitors", description: "List all monitors", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
      (a) => c.getMonitors(a.workspaceId as string | undefined)
    ),
    get_monitor: cmd(
      { name: "get_monitor", description: "Get a specific monitor", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getMonitor(a.id as string)
    ),
    run_monitor: cmd(
      { name: "run_monitor", description: "Manually trigger a monitor run", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.runMonitor(a.id as string)
    ),
    delete_monitor: cmd(
      { name: "delete_monitor", description: "Delete a monitor", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.deleteMonitor(a.id as string)
    ),

    // APIs
    get_apis: cmd(
      { name: "get_apis", description: "List all APIs/specs", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
      (a) => c.getApis(a.workspaceId as string | undefined)
    ),
    get_api: cmd(
      { name: "get_api", description: "Get a specific API/spec by ID", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
      (a) => c.getApi(a.id as string)
    ),

    // Search
    search: cmd(
      { name: "search", description: "Search across all Postman resources", input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
      (a) => c.search(a.query as string)
    ),
  };
}
