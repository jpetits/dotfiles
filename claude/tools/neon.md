## Neon

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

Clé: `~/dotfiles/tools/.env` → `NEON_API_KEY` (clé personnelle, pas org)

| Commande | Args requis |
|---|---|
| `neon_get_me` | — |
| `neon_get_projects` | — |
| `neon_get_project` | `--id` |
| `neon_get_branches` | `--projectId` |
| `neon_get_branch` | `--projectId`, `--branchId` |
| `neon_get_endpoints` | `--projectId` |
| `neon_get_connection_uri` | `--projectId`, `--database` (opt, défaut: neondb), `--role` (opt), `--branchId` (opt) |
| `neon_run_query` | `--projectId`, `--query`, `--database` (opt, défaut: neondb), `--branchId` (opt, auto-résolu) |
