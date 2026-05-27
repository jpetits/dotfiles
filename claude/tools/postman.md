## Postman

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

Clé: `~/dotfiles/tools/.env` → `POSTMAN_API_KEY`

| Commande | Args requis |
|---|---|
| `get_me` | — |
| `get_workspaces` / `get_workspace` | `--id` |
| `get_collections` / `get_collection` | `--id`, `--workspaceId` (opt) |
| `create_collection` | `--name`, `--workspaceId` (opt) |
| `patch_collection` / `delete_collection` | `--id` |
| `get_collection_request` | `--collectionId`, `--requestId` |
| `create_collection_request` | `--collectionId`, `--name`, `--method`, `--url` |
| `delete_collection_request` | `--collectionId`, `--requestId` |
| `create_collection_folder` / `delete_collection_folder` | `--collectionId`, `--name` / `--folderId` |
| `get_environments` / `get_environment` | `--id`, `--workspaceId` (opt) |
| `create_environment` | `--name`, `--values` (JSON), `--workspaceId` (opt) |
| `update_environment` | `--id`, `--name`, `--values` (JSON) |
| `delete_environment` | `--id` |
| `get_mocks` / `get_mock` / `delete_mock` | `--id` |
| `create_mock` | `--collectionId`, `--name` |
| `get_monitors` / `get_monitor` / `run_monitor` / `delete_monitor` | `--id` |
| `get_apis` / `get_api` | `--id` |
| `search` | `--query` |
