## Clerk

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <commande> [--arg valeur]
```

Clé: `~/dotfiles/tools/.env` → `CLERK_SECRET_KEY`

| Commande | Args requis |
|---|---|
| `clerk_get_users` | `--limit` (opt), `--email_address` (opt), `--username` (opt) |
| `clerk_get_user` | `--userId` |
| `clerk_delete_user` | `--userId` |
| `clerk_ban_user` / `clerk_unban_user` | `--userId` |
| `clerk_get_user_sessions` | `--userId` |
| `clerk_get_sessions` | `--limit` (opt), `--status` (opt) |
| `clerk_revoke_session` | `--sessionId` |
