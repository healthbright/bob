## Skill Sharing

Share skills across machines and teams using **Skillshare** and a Git repository. Only skills are shared — rules, commands, and agents are project-specific and stay in the repo.

### Two Modes

| Mode | Source Directory | Scope | Shared Via |
|------|-----------------|-------|------------|
| **Global** (`-g`) | `~/.config/skillshare/skills/` | All projects | Git remote (Team Remote) |
| **Project** (`-p`) | `.skillshare/skills/` | This repo only | Committed to repo |

Skills in the **source** are synced to the **target** (`~/.claude/skills/`) where Claude uses them. The sync button only appears when source and target differ.

### Sharing Tiers

| Tier | Feature | License |
|------|---------|---------|
| **All paid users** | Install, sync, cross-machine push/pull | Solo, Team, Trial |
| **Team/Trial only** | Team Remote, tracked repos, organization features | Team, Trial |

### Primary Interface

**Use the Share page in the Pilot Shell Console dashboard** (`http://localhost:41777/#/share`):

- **Source & Sync card** — shows Project (first) and Global sections with source → target arrows, per-section sync buttons (only when out of sync), and Collect button for local-only skills
- **Team Remote card** — manage multiple git remotes for global skills (Team/Trial plan). Push uploads current global state; Pull downloads from remote
- **Skills grid** — merged view of all global + project skills with scope badges
- **Install from URL** — paste a GitHub URL to install globally or to a project
- **How does this work?** — collapsed help section with explanations and documentation links
- **CLI Reference** — collapsed section with global and project commands side by side

### Key Concepts

- **Sync**: Copies skills from source directory to `~/.claude/skills/`. Only shown when out of sync.
- **Collect**: Imports skills that exist only in Claude's directory (e.g., from `/learn`) back into the source directory so they can be pushed/shared.
- **Team Remote**: Git remotes for **global skills only**. Project skills are shared by committing `.skillshare/` to the project repo instead.
- **Push**: Uploads current global skills to remote. Skills removed locally will also be removed from the remote.

### /learn and /sync Integration

Both `/learn` and `/sync` create skills in `.skillshare/skills/` **if it exists** in the project. Otherwise they fall back to `.claude/skills/`. When creating in `.skillshare/`, they run `skillshare sync -p` afterward to make the skill available to Claude. This works independently — if Skillshare isn't used, skills go directly to `.claude/skills/` as before.

### When to Use

| Situation | Action |
|-----------|--------|
| User says "share", "push", "sync skills" | Direct to Share page in Console |
| After `/learn` captures a new skill | Use Collect to import to source, then push |
| User wants skills on another machine | Set up Team Remote, push from source, pull on target |
| New team member onboarding | `skillshare install -p && skillshare sync -p` |
| Org-wide skill distribution | `skillshare install <url> --track` (Team plan) |

### CLI Quick Reference

```bash
# Global commands
skillshare status -g              # Global status
skillshare list -g                # List global skills
skillshare sync -g                # Sync global source → Claude
skillshare install <url> -g       # Install to global
skillshare collect -g             # Import local-only skills to source
skillshare diff -g                # Show pending changes

# Project commands
skillshare init -p                # Initialize project mode
skillshare status -p              # Project status
skillshare list -p                # List project skills
skillshare sync -p                # Sync project source → Claude
skillshare install <url> -p       # Install to project
skillshare collect -p             # Import local-only skills
skillshare diff -p                # Show pending changes

# Cross-machine sync (global only)
skillshare init --remote <url>    # Set up git remote
skillshare push -m "Add skill"    # Commit and push to remote
skillshare pull                   # Pull from remote and sync

# Organization (Team/Trial)
skillshare install <url> --track  # Install tracked org repo
skillshare update --all           # Update all tracked repos
skillshare audit                  # Security audit of skills
skillshare doctor                 # Diagnose issues
skillshare new my-skill           # Create a new skill
```

### Setup

Skillshare is installed automatically by the Pilot installer. For cross-machine sync, add a Team Remote via the Console Share page, or:

```bash
skillshare init --remote git@github.com:you/my-skills.git
```

### Project Mode

Project-level skills live in `.skillshare/skills/` and are committed to the repo:

```bash
skillshare init -p                    # Initialize project config
skillshare install <url> -p           # Install skill at project level
skillshare sync -p                    # Sync project skills to target
```

New team members get all project skills with:
```bash
git clone <repo> && cd <repo> && skillshare install -p && skillshare sync -p
```

### Documentation

- [Quick Start](https://skillshare.runkids.cc/docs/learn/with-claude-code)
- [Cross-Machine Sync](https://skillshare.runkids.cc/docs/how-to/sharing/cross-machine-sync)
- [Project Setup](https://skillshare.runkids.cc/docs/how-to/sharing/project-setup)
- [Organization Sharing](https://skillshare.runkids.cc/docs/how-to/sharing/organization-sharing)
- [Full Command Reference](https://skillshare.runkids.cc/docs/reference/commands)
