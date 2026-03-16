---
sidebar_position: 1
title: /setup-rules — Rules Setup
description: Generate project rules, audit your codebase, and create AGENTS.md for cross-tool compatibility
---

# /setup-rules — Rules Setup

Generate project rules and set up cross-tool AI compatibility.

Run `/setup-rules` to explore your project structure, discover your conventions and undocumented patterns, update project documentation, generate `AGENTS.md` for cross-tool compatibility, and document your MCP servers. This is how Pilot adapts to your project — not the other way around. Run it once initially, then any time your codebase changes significantly.

```bash
$ pilot
> /setup-rules
```

## What /setup-rules Does

12 phases:

| Phase | Action |
|-------|--------|
| 0 | Load reference guidelines, recommended directory structure, error handling |
| 1 | Read existing rules (including nested subdirectories), detect structure and path-scoping |
| 2 | Migrate unscoped assets to `{slug}`-prefixed names |
| 3 | Quality audit against best practices (size, specificity, path-scoping enforcement) |
| 4 | Explore codebase with Probe CLI, codebase-memory-mcp, and Grep to find patterns |
| 5 | Compare discovered vs documented patterns |
| 6 | Sync project rule, nested directories, and generate rules README |
| 7 | Sync MCP server documentation |
| 8 | Discover new rules, place in correct directory by scope |
| 9 | Generate `AGENTS.md` — consolidates all rules into one file for Cursor, Codex, Amp, and more |
| 10 | Cross-check: validate references, README, path-scoping |
| 11 | Report summary of all changes made |

## What is AGENTS.md?

`AGENTS.md` is a [universal standard](https://agents.md/) used by 60k+ open-source projects. It's a plain markdown file at the project root that any AI coding tool can read — Claude Code, Cursor, Codex, Amp, Jules, and more.

**Why it matters:** `.claude/rules/` files are modular and only work with Claude Code. Other tools like Cursor, Codex, Gemini CLI, and Copilot can only read `AGENTS.md`. `/setup-rules` consolidates **all** your modular rules into one comprehensive `AGENTS.md` — not just a project summary, but the full tribal knowledge: commit standards, architectural patterns, installer conventions, testing requirements, and gotchas. This ensures every team member gets consistent AI context regardless of which tool they use.

If an existing `AGENTS.md` is found (hand-written or from another tool), `/setup-rules` offers a migration path: merge with your rules, regenerate, or skip — just like it handles existing `CLAUDE.md` files.

## When to Run /setup-rules

- After installing Pilot in a new project
- After making significant architectural changes
- When adding new MCP servers to `.mcp.json`
- Before starting a complex `/spec` task on an unfamiliar codebase
- After onboarding to a project you didn't write

:::tip Creating skills
Use `/create-skill` to create workflow skills — `/setup-rules` focuses exclusively on rules and cross-tool compatibility (AGENTS.md).
:::
