# dotfiles

Personal configuration files for a new machine setup.

## Structure

```
dotfiles/
├── .gitconfig              # Git identity and aliases
├── .zshrc                  # Zsh config, aliases, PATH
├── claude/
│   ├── CLAUDE.md           # Global Claude Code instructions
│   ├── RTK.md              # RTK (token optimizer) instructions
│   ├── .mcp.json           # MCP servers (Chrome DevTools, CodeGraph, Context7)
│   ├── settings.json       # Claude Code settings, permissions, hooks
│   ├── statusline-command.sh
│   ├── rules/
│   │   └── context7.md     # Rule: always use Context7 for library docs
│   └── tools/              # Per-tool docs, loaded on demand (not in context)
│       ├── postman.md
│       ├── neon.md
│       └── clerk.md
└── tools/                  # Custom CLI tools for Claude
    ├── src/
    │   ├── cli.ts              # CLI entry point — called by Claude via Bash
    │   ├── types.ts            # Shared Command/Registry types
    │   ├── client.ts           # Postman REST API client
    │   ├── postman-service.ts  # Postman commands + tool definitions
    │   ├── neon.ts             # Neon REST API client
    │   ├── neon-service.ts     # Neon commands + tool definitions
    │   ├── clerk.ts            # Clerk REST API client
    │   ├── clerk-service.ts    # Clerk commands + tool definitions
    │   └── agent.ts            # Interactive Anthropic agent (Postman)
    ├── .env.example
    └── package.json
```

## CLI tools

All tools share a single CLI entry point:

```bash
cd ~/dotfiles/tools && npx tsx src/cli.ts <command> [--arg value]
```

Available tools: **Postman**, **Neon** (Postgres), **Clerk** (auth).
Full command reference: `claude/tools/{postman,neon,clerk}.md`

Adding a new service: create `src/<name>.ts` (API client) + `src/<name>-service.ts` (registry), then add one line in `cli.ts`.

## Setup on a new machine

```bash
git clone git@github.com:jpetits/dotfiles.git ~/dotfiles

# Zsh
ln -sf ~/dotfiles/.zshrc ~/.zshrc
ln -sf ~/dotfiles/.gitconfig ~/.gitconfig

# Claude Code
mkdir -p ~/.claude/rules
ln -sf ~/dotfiles/claude/settings.json ~/.claude/settings.json
ln -sf ~/dotfiles/claude/.mcp.json ~/.claude/.mcp.json
ln -sf ~/dotfiles/claude/CLAUDE.md ~/.claude/CLAUDE.md
ln -sf ~/dotfiles/claude/RTK.md ~/.claude/RTK.md
ln -sf ~/dotfiles/claude/statusline-command.sh ~/.claude/statusline-command.sh
ln -sf ~/dotfiles/claude/rules/context7.md ~/.claude/rules/context7.md

# CLI tools
cd ~/dotfiles/tools && npm install
cp ~/dotfiles/tools/.env.example ~/dotfiles/tools/.env
# Edit .env and add: POSTMAN_API_KEY, NEON_API_KEY (personal key), CLERK_SECRET_KEY

# Secrets — create ~/.secrets with your API keys (never committed):
cat > ~/.secrets << 'EOF'
export CONTEXT7_API_KEY=your-context7-api-key
EOF
