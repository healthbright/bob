---
slug: team-vault-sharing-ai-assets
title: "Sharing Skills Across Your Team with Skillshare"
description: "Sync skills across machines and teams using Skillshare. From personal cross-machine sync to org-wide hubs — keep every developer's Claude consistent."
authors: [max]
tags: [Feature, Teams]
keywords: [Claude Code team, shared skills, skillshare, cross-machine sync, organization hub, team consistency]
---

# Sharing Skills Across Your Team with Skillshare

Every team member configures Claude Code differently — different skills, different workflows. This creates inconsistency: one developer's Claude knows the deployment workflow, another's doesn't. Skillshare solves this by syncing skills through Git — from personal cross-machine sync to org-wide distribution.

## The Consistency Problem

Without shared configuration:

- Skills captured on one machine don't follow you to others
- Best practices discovered by one developer stay local
- New team members start from zero
- Onboarding means manually copying skill files

## What Skillshare Shares

Only **skills** are shared — rules, commands, and agents are project-specific and stay in the repo where they belong.

| Asset | Path | Shared Via |
|-------|------|-----------|
| **Skills** | `.claude/skills/*/` | Skillshare source → targets |

Skills live in a single source directory and are symlinked to every AI CLI target. Edit once, sync everywhere with `skillshare sync`.

## Three Sharing Tiers

| Tier | Feature | License |
|------|---------|---------|
| All users | Install from URL, sync to Claude | Solo, Team, Trial |
| All paid | Cross-machine push/pull | Solo, Team, Trial |
| Team/Trial | Org hub, tracked repos, hub search | Team, Trial only |

## Cross-Machine Sync (Solo+)

Connect a git remote to sync your personal skills across machines:

```bash
# First machine
skillshare init --remote git@github.com:you/my-skills.git
skillshare push -m "Add deploy skill"

# Second machine
skillshare init --remote git@github.com:you/my-skills.git
# → pulls automatically and syncs to ~/.claude/skills/
```

## Organization Hub (Team Plan)

For team-wide distribution, install a tracked repo — everyone pulls the same skills:

```bash
# Team lead: set up org skills repo
skillshare install github.com/org/skills --track
skillshare sync

# Team members: install and stay in sync
skillshare update --all && skillshare sync
```

## Project Mode (All Plans)

Commit skills to your repo for instant onboarding:

```bash
skillshare init -p    # Creates .skillshare/ in project root
skillshare sync -p    # Symlinks to project .claude/skills/
git add .skillshare/
git commit -m "Add project skills"
```

New team members get all skills automatically:

```bash
git clone https://github.com/team/my-project
cd my-project && skillshare install -p && skillshare sync -p
```

## Practical Workflow

1. **Developer discovers pattern** — A debugging workflow that saves time
2. **Capture with /learn** — Pilot extracts it as a skill
3. **Share via Console** — Push from the Share dashboard or `skillshare push`
4. **Team syncs** — `skillshare update --all && skillshare sync`
5. **Everyone benefits** — Claude knows the pattern in all sessions

This creates a flywheel: the more the team uses Claude, the smarter everyone's Claude gets.
