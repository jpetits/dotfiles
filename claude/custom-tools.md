# Custom CLI Tools

## Postman

Pour toute opération Postman, utilise directement ce CLI (pas de MCP, pas d'API Anthropic) :

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

La clé API est dans `~/code/postman-agent/.env` — chargée automatiquement.

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

## Neon

Pour toute opération Neon (base de données Postgres), utilise le même CLI :

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

La clé API est dans `~/dotfiles/tools/.env` sous `NEON_API_KEY`.

| Commande | Args requis |
|---|---|
| `neon_get_me` | — |
| `neon_get_projects` | — |
| `neon_get_project` | `--id` |
| `neon_get_branches` | `--projectId` |
| `neon_get_branch` | `--projectId`, `--branchId` |
| `neon_get_endpoints` | `--projectId` |
| `neon_get_connection_uri` | `--projectId`, `--database` (opt, défaut: neondb), `--role` (opt), `--branchId` (opt) |
| `neon_run_query` | `--projectId`, `--query`, `--database` (opt, défaut: neondb), `--branchId` (opt) |

## Clerk

Pour toute opération Clerk (auth/users), utilise le même CLI :

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

La clé API est dans `~/dotfiles/tools/.env` sous `CLERK_SECRET_KEY`.

| Commande | Args requis |
|---|---|
| `clerk_get_users` | `--limit` (opt), `--email_address` (opt), `--username` (opt) |
| `clerk_get_user` | `--userId` |
| `clerk_delete_user` | `--userId` |
| `clerk_ban_user` / `clerk_unban_user` | `--userId` |
| `clerk_get_user_sessions` | `--userId` |
| `clerk_get_sessions` | `--limit` (opt), `--status` (opt) |
| `clerk_revoke_session` | `--sessionId` |
