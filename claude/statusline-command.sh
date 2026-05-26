#!/bin/sh
input=$(cat)
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd')
model=$(echo "$input" | jq -r '.model.display_name // empty')
used=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

# User and host
user=$(whoami)
host=$(hostname -s)

# Shorten home directory to ~
home="$HOME"
short_cwd=$(echo "$cwd" | sed "s|^$home|~|")

# Git branch (skip optional locks)
git_branch=""
if git -C "$cwd" rev-parse --git-dir > /dev/null 2>&1; then
  git_branch=$(git -C "$cwd" -c gc.auto=0 symbolic-ref --short HEAD 2>/dev/null || git -C "$cwd" -c gc.auto=0 rev-parse --short HEAD 2>/dev/null)
fi

# Build status line
printf "\033[36m%s@%s\033[0m \033[33m%s\033[0m" "$user" "$host" "$short_cwd"

if [ -n "$git_branch" ]; then
  printf " \033[35m(%s)\033[0m" "$git_branch"
fi

if [ -n "$model" ]; then
  printf " \033[90m[%s]\033[0m" "$model"
fi

if [ -n "$used" ]; then
  printf " \033[90mctx:%s%%\033[0m" "$(printf '%.0f' "$used")"
fi

printf "\n"
