## Research Tools

### Search Priority

**⛔ Probe CLI first for intent-based search.** Finds by intent, not exact text. Instant results (<0.3s). Run via Bash.

**⛔ codebase-memory-mcp for structural queries.** Call tracing, dead code, impact analysis, graph queries. Use via MCP tools.

**Search chain:** Probe CLI (`probe search`) → codebase-memory-mcp (structural) → Grep/Glob (exact patterns)

Full Probe reference in `cli-tools.md`. Full MCP tool reference in `mcp-servers.md`.

### Tool Selection Guide

| Need | Tool | Notes |
|------|------|-------|
| **Codebase search** | **Probe CLI** (`probe search`) | Always first. Semantic, by intent. Run via Bash. |
| Exact pattern / known symbol | Grep / Glob | Only after Probe misses |
| Extract specific code block | Probe CLI (`probe extract`) | AST-aware, by line or symbol name |
| AST pattern matching | Probe CLI (`probe query`) | Find structural patterns (all functions, classes) |
| **Call tracing / who calls X** | **codebase-memory-mcp** | `trace_call_path` — replaces manual grep chains |
| **Dead code / quality analysis** | **codebase-memory-mcp** | `search_graph` with degree filters |
| **Impact analysis / blast radius** | **codebase-memory-mcp** | `detect_changes` maps diffs to affected symbols |
| **Structural graph queries** | **codebase-memory-mcp** | `query_graph` (Cypher) for relationship patterns |
| Library/framework docs | Context7 (MCP) | `resolve-library-id` → `query-docs` |
| Production code examples | grep-mcp (MCP) | Literal code patterns, not keywords |
| Web search | web-search (MCP) | DuckDuckGo/Bing/Exa |
| Full web page | web-fetch (MCP) | Playwright-based, handles JS |
| GitHub README | web-search (MCP) | `fetchGithubReadme` |
| GitHub operations | `gh` CLI | Authenticated, `--json` + `--jq` |
| Past work / decisions | mem-search (MCP) | `search` → `timeline` → `get_observations` |

### Agent Tool — Prefer Direct Tools

**Prefer doing work directly** with Probe, codebase-memory-mcp, Grep/Glob, and Bash instead of launching sub-agents. Sub-agents waste tokens duplicating work you can do yourself. The hook will warn (not block) on general Agent calls.

**⛔ Do NOT use the built-in Explore agent** (`subagent_type=Explore`) for codebase exploration. Use Probe CLI for intent-based search and codebase-memory-mcp for structural analysis instead — they are faster, more precise, and don't waste context on sub-agent overhead.

**`/spec` reviewer agents** (`pilot:plan-reviewer`, `pilot:spec-reviewer`) pass through silently — these are expected parts of the workflow.

### ⛔ Web Search/Fetch

**NEVER use built-in `WebFetch` or `WebSearch` — blocked by hook.** Use MCP alternatives via `ToolSearch`:

| Need | ToolSearch query |
|------|-----------------|
| Web search | `+web-search search` |
| GitHub README | `+web-search fetch` |
| Fetch page | `+web-fetch fetch` |
