import type Anthropic from "@anthropic-ai/sdk";

export const tools: Anthropic.Tool[] = [
  { name: "get_me", description: "Get authenticated Postman user info", input_schema: { type: "object", properties: {} } },

  // Workspaces
  { name: "get_workspaces", description: "List all Postman workspaces", input_schema: { type: "object", properties: {} } },
  { name: "get_workspace", description: "Get a specific workspace by ID", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "create_workspace", description: "Create a new Postman workspace", input_schema: { type: "object", properties: { name: { type: "string" }, type: { type: "string", enum: ["personal", "team", "private", "public"] }, description: { type: "string" } }, required: ["name", "type"] } },
  { name: "delete_workspace", description: "Delete a workspace", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  // Collections
  { name: "get_collections", description: "List all collections, optionally filtered by workspace", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
  { name: "get_collection", description: "Get a collection with all its requests and folders", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "create_collection", description: "Create a new collection", input_schema: { type: "object", properties: { name: { type: "string" }, workspaceId: { type: "string" }, description: { type: "string" } }, required: ["name"] } },
  { name: "patch_collection", description: "Update collection name/description", input_schema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" } }, required: ["id"] } },
  { name: "delete_collection", description: "Delete a collection", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "fork_collection", description: "Fork a collection into a workspace", input_schema: { type: "object", properties: { id: { type: "string" }, label: { type: "string" }, workspaceId: { type: "string" } }, required: ["id", "label", "workspaceId"] } },

  // Collection requests
  { name: "get_collection_request", description: "Get a specific request from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, requestId: { type: "string" } }, required: ["collectionId", "requestId"] } },
  { name: "create_collection_request", description: "Add a request to a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, folderId: { type: "string" }, name: { type: "string" }, method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] }, url: { type: "string" }, description: { type: "string" }, headers: { type: "array", items: { type: "object" } }, body: { type: "object" } }, required: ["collectionId", "name", "method", "url"] } },
  { name: "delete_collection_request", description: "Delete a request from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, requestId: { type: "string" } }, required: ["collectionId", "requestId"] } },

  // Collection folders
  { name: "create_collection_folder", description: "Create a folder inside a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, name: { type: "string" }, description: { type: "string" } }, required: ["collectionId", "name"] } },
  { name: "delete_collection_folder", description: "Delete a folder from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, folderId: { type: "string" } }, required: ["collectionId", "folderId"] } },

  // Environments
  { name: "get_environments", description: "List all environments", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
  { name: "get_environment", description: "Get a specific environment with its variables", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "create_environment", description: "Create a new environment with variables", input_schema: { type: "object", properties: { name: { type: "string" }, workspaceId: { type: "string" }, values: { type: "array", items: { type: "object", properties: { key: { type: "string" }, value: { type: "string" }, enabled: { type: "boolean" }, type: { type: "string", enum: ["default", "secret"] } } } } }, required: ["name"] } },
  { name: "update_environment", description: "Update an environment's variables", input_schema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, values: { type: "array", items: { type: "object" } } }, required: ["id"] } },
  { name: "delete_environment", description: "Delete an environment", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  // Mocks
  { name: "get_mocks", description: "List all mock servers", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
  { name: "get_mock", description: "Get a specific mock server", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "create_mock", description: "Create a mock server from a collection", input_schema: { type: "object", properties: { collectionId: { type: "string" }, name: { type: "string" }, workspaceId: { type: "string" }, environmentId: { type: "string" } }, required: ["collectionId", "name"] } },
  { name: "delete_mock", description: "Delete a mock server", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  // Monitors
  { name: "get_monitors", description: "List all monitors", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
  { name: "get_monitor", description: "Get a specific monitor", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "run_monitor", description: "Manually trigger a monitor run", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "delete_monitor", description: "Delete a monitor", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  // APIs
  { name: "get_apis", description: "List all APIs/specs", input_schema: { type: "object", properties: { workspaceId: { type: "string" } } } },
  { name: "get_api", description: "Get a specific API/spec by ID", input_schema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },

  // Search
  { name: "search", description: "Search across all Postman resources", input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];
