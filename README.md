# Bob - Claude Code Enhancement Shell

> **Can we fix it? Yes we can!**

Bob is a free, open-source enhancement shell for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). It adds structured workflows, quality hooks, persistent memory, and best-practice rules — all without any licensing or payment required.

Forked from [Pilot Shell](https://github.com/maxritter/pilot-shell), with all paywall and licensing restrictions removed.

## What You Get

- **Spec-Driven Development** — `/spec` for planning, approval gates, and TDD implementation
- **Quality Hooks** — TDD enforcer, auto-linting, type checking, LSP integration
- **Rules & Skills** — Best practices loaded automatically, fully customizable
- **Persistent Memory** — Context carries across sessions via intelligent hooks
- **MCP Servers** — Web search, library docs, code search, memory — all built in

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/healthbright/bob/main/install.sh | bash
```

Or install locally from a clone:

```bash
git clone https://github.com/healthbright/bob.git
cd bob
bash install.sh --local
```

## Usage

```bash
bob              # Launch Claude Code with Bob enhancements
```

Once inside Claude Code, Bob's hooks, rules, and skills are active automatically:

- `/spec` — Structured spec-driven development (planning + TDD + verification)
- `/setup-rules` — Generate project-specific rules
- `/create-skill` — Create reusable skills

## Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/healthbright/bob/main/uninstall.sh | bash
```

## License

MIT — free to use, modify, and distribute.

## Credits

Based on [Pilot Shell](https://github.com/maxritter/pilot-shell) by Max Ritter, with licensing restrictions removed by HealthBright.
