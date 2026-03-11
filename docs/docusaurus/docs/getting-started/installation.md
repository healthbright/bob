---
sidebar_position: 2
title: Installation
description: One-command installation — works with any existing project
---

# Installation

Works with any existing project — no scaffolding required.

## One-Command Installation

```bash
curl -fsSL https://raw.githubusercontent.com/maxritter/pilot-shell/main/install.sh | bash
```

Run from any directory — it installs globally to `~/.pilot/` and `~/.claude/`. After installation, `cd` into any project and run `pilot` or `ccp` to start.

## What the Installer Does

7 steps with progress tracking and rollback on failure:

| Step | Title | Description |
|------|-------|-------------|
| 1 | Prerequisites | Checks Homebrew, Node.js, Python 3.12+, uv, git |
| 2 | Dependencies | Installs Probe (code search), playwright-cli, language servers |
| 3 | Shell integration | Auto-configures bash, fish, and zsh with the pilot alias |
| 4 | Config & Claude files | Sets up `.claude/` plugin — rules, commands, hooks, MCP servers |
| 5 | VS Code extensions | Installs recommended extensions for your language stack |
| 6 | Automated updater | Checks for updates on launch with release notes and one-key upgrade |
| 7 | Cross-platform | Works on macOS, Linux, Windows (WSL2) |

## Install Specific Version

```bash
export VERSION=6.9.3
curl -fsSL https://raw.githubusercontent.com/maxritter/pilot-shell/main/install.sh | bash
```

See [releases](https://github.com/maxritter/pilot-shell/releases) for all available versions. Useful when a specific version is known stable.

## Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/maxritter/pilot-shell/main/uninstall.sh | bash
```

Removes binary, plugin files, managed commands/rules, settings, and shell aliases. Your project's custom `.claude/` files are preserved.
