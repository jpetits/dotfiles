# dotfiles

Personal configuration files for a new machine setup.

## Structure

```
dotfiles/
├── .gitconfig              # Git identity and aliases
├── .zshrc                  # Zsh config, aliases, PATH
└── claude/
    ├── CLAUDE.md           # Global Claude Code instructions
    ├── RTK.md              # RTK (token optimizer) instructions
    ├── .mcp.json           # MCP servers (Postman, Chrome DevTools)
    ├── settings.json       # Claude Code settings, permissions, hooks
    ├── statusline-command.sh
    └── rules/
        └── context7.md     # Rule: always use Context7 for library docs
```

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
```
