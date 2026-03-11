---
sidebar_position: 1
title: Skill Sharing
description: Share skills across machines and teams — from personal sync to org-wide hubs
---

# Skill Sharing

Share skills across machines and teams — from personal sync to org-wide hubs.

The Share page in the Pilot Console manages skills using [Skillshare](https://github.com/runkids/skillshare). Three modes cover different scopes: **Global** for personal cross-machine sync, **Project** for team-shared skills committed to the repo, and **Organization** for tracked repos and hub-based distribution. Only skills are shared — rules, commands, and agents stay project-specific.

## Sharing Tiers

### Global Mode (Solo+)

- Install skills from GitHub URLs
- Sync skills to `~/.claude/skills/`
- Cross-machine sync via git push/pull

### Project Mode (All plans)

- Commit skills to repo for team sharing
- New members get skills on git clone
- Separate from global skills — no conflicts

### Organization Hub (Team)

- Tracked repos for org-wide distribution
- Hub index — curated skill catalogs
- One command for team onboarding

## Setup

Skillshare is installed automatically by the Pilot installer. Open the Console dashboard and navigate to the **Share** page to manage skills. The page shows your current mode (Global or Project), synced skills, git remote status, and documentation links.

```bash
# Cross-machine sync (Global mode)
$ skillshare init --remote git@github.com:you/my-skills.git

# Project mode — team sharing via git
$ skillshare init -p --targets claude

# Organization hub (Team plan)
$ skillshare install github.com/org/skills --track
```

### Project Mode

Commit `.skillshare/skills/` to your repo. New team members get all skills on clone — no extra setup.

### Organization Hub

Track shared repos for org-wide distribution. Build a hub index for searchable skill catalogs.

## Documentation

- [Project Setup](https://skillshare.runkids.cc/docs/how-to/sharing/project-setup) — Commit skills to your repo
- [Cross-Machine Sync](https://skillshare.runkids.cc/docs/how-to/sharing/cross-machine-sync) — Sync via git push/pull
- [Organization Sharing](https://skillshare.runkids.cc/docs/how-to/sharing/organization-sharing) — Tracked repos for teams
- [Hub Index Guide](https://skillshare.runkids.cc/docs/how-to/sharing/hub-index) — Build a skill catalog
