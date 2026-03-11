---
description: Use after significant debugging, workarounds, or multi-step workflows worth standardizing for future sessions
model: opus
---

# /learn - Online Learning System

**Extract reusable knowledge from this session into skills.** Evaluates what was learned, checks for existing skills, creates new ones when valuable.

---

## Phase 0: Reference

### Triggers

| Trigger | Example |
|---------|---------|
| **Non-obvious debugging** | Spent 10+ minutes; solution wasn't in docs |
| **Misleading errors** | Error message pointed wrong direction; found real cause |
| **Workarounds** | Found limitation and creative solution |
| **Tool integration** | Undocumented API/tool usage |
| **Trial-and-error** | Tried multiple approaches before finding what worked |
| **Repeatable workflow** | Multi-step task that will recur |
| **External service queries** | Fetched from Jira, GitHub, Confluence |
| **User-facing automation** | Reports, status checks user will ask for again |

### Quality Criteria

- **Reusable**: Will help future tasks, not just this instance
- **Non-trivial**: Required discovery or is a valuable workflow pattern
- **Verified**: Solution actually worked

**Do NOT extract:** Single-step tasks, one-off fixes, knowledge in official docs.

### Project Slug

Prefix ALL created skills with the project slug to avoid name collisions across repos.

```bash
SLUG=$(basename "$(git remote get-url origin 2>/dev/null | sed 's/\.git$//')" 2>/dev/null || basename "$PWD")
# Result: "pilot-shell", "my-api", "acme-backend"
```

**Skill directory:** If `.skillshare/skills/` exists in the project, create skills there and run `skillshare sync -p` afterward. Otherwise, create directly in `.claude/skills/`.

| `.skillshare/skills/` exists? | Create in | After creating |
|-------------------------------|-----------|----------------|
| Yes | `.skillshare/skills/{slug}-{name}/SKILL.md` | Run `skillshare sync -p` |
| No | `.claude/skills/{slug}-{name}/SKILL.md` | Nothing needed |

**Naming rules:** Lowercase with hyphens only. The slug provides context; the name should be 1-3 words max that are descriptive (not generic). Examples: `pilot-shell-lsp-cleaner`, `my-api-auth-flow`, `acme-deploy`. Never use generic names like "helper", "utils", "tools", "handler", "workflow".

### Skill Complexity Spectrum

Before writing, decide WHERE your skill falls. **Move left whenever possible** — simpler skills are more reliable, cheaper to execute, and work across more models.

| Level | Style | Determinism | Best For |
|-------|-------|-------------|----------|
| **Passive** | Context only | N/A | Background knowledge, coding standards |
| **Instructional** | Rules + guidelines | Medium | Code review, style guides |
| **CLI Wrapper** | Calls a binary/script | **High** | Automation, integrations, data processing |
| **Workflow** | Multi-step with validation | Medium | Deploy pipelines, migrations |
| **Generative** | Asks agent to write code | Low | Scaffolding, code generation |

**Key insight:** A skill that says "run `eslint --fix`" works on any model. A skill that says "analyze the code and suggest improvements" requires expensive reasoning. Prefer commands over descriptions, scripts over instructions, explicit values over judgment.

### Skill Template

**Location:** `.skillshare/skills/{slug}-{skill-name}/SKILL.md` (if `.skillshare/skills/` exists) or `.claude/skills/{slug}-{skill-name}/SKILL.md`

Before writing, answer these five questions:

1. **When should this skill activate?** (→ becomes `description`)
2. **What inputs does it need?** (arguments, files, environment state)
3. **What does success look like?** (specific output, files created, commands run)
4. **What should it NOT do?** (explicit exclusions prevent scope creep)
5. **How do you verify it worked?** (include a validation step)

```markdown
---
name: {slug}-descriptive-kebab-case-name
description: |
  [CRITICAL: Describe WHEN to use, not HOW it works. Include trigger conditions, scenarios, exact error messages.]
author: Claude Code
version: 1.0.0
---

# Skill Name

## When to Use
[Specific trigger conditions — be precise]

## Solution
[Steps — ordered, concrete, verifiable. Prefer exact commands over descriptions.]

## Verification
[How to confirm it worked]

## When NOT to Use
[Explicit exclusions — prevents scope creep and misactivation]

## Example
[Concrete input/output example]

## References
```

**⚠️ The Description Trap:** If description summarizes the workflow, Claude follows the short description as a shortcut instead of reading SKILL.md. Always describe trigger conditions, not process.

✅ `"Fix for ENOENT errors in npm monorepos. Use when: (1) npm run fails with ENOENT, (2) symlinked deps cause failures."`
❌ `"Extract and organize npm monorepo fixes by analyzing symlinks and paths."`

### Progressive Disclosure

Don't dump everything into SKILL.md. Layer content so the AI loads only what it needs.

| Layer | What | Context Cost |
|-------|------|--------------|
| **Metadata** | `description` in frontmatter | Always loaded (~100 tokens) |
| **Body** | SKILL.md instructions | Loaded on activation |
| **Scripts/Assets** | `scripts/`, `examples/` subdirs | Executed or path-referenced, never loaded |

**Rule of thumb:** "Is this line worth the context tokens it costs?" Don't explain what AI already knows. Only add your project's specific conventions, internal APIs, and domain rules.

**Guidelines:** Concise (Claude is smart). Under 500 lines for body. Examples over explanations. Put detailed reference docs in `references/` subdirectory.

---

## Phase 1: Evaluate

Ask yourself:

1. "What did I learn that wasn't obvious before starting?"
2. "Would future-me benefit from having this documented?"
3. "Was the solution non-obvious from docs alone?"
4. "Is this a multi-step workflow I'd repeat?"
5. "Did I query an external service the user will ask about again?"

**If NO to all → Skip, nothing to learn.** External service queries are almost always worth extracting.

---

## Phase 2: Check Existing

```bash
ls .skillshare/skills/ 2>/dev/null
ls .claude/skills/ 2>/dev/null
rg -i "keyword" .skillshare/skills/ .claude/skills/ 2>/dev/null
ls ~/.claude/pilot/skills/ 2>/dev/null
rg -i "keyword" ~/.claude/pilot/skills/ 2>/dev/null
```

| Found | Action |
|-------|--------|
| Nothing related | Create new |
| Same trigger/fix | Update existing (bump version) |
| Partial overlap | Update with new variant |

---

## Phase 3: Create Skill

**Determine output directory:**

```bash
if [ -d ".skillshare/skills" ]; then
  # Skillshare project mode — create in source, then sync
  SKILL_BASE=".skillshare/skills"
else
  SKILL_BASE=".claude/skills"
fi
```

Write to `${SKILL_BASE}/{slug}-{skill-name}/SKILL.md` using the template from Phase 0.

**After creating (only if using `.skillshare/`):** Run `skillshare sync -p` to sync the new skill to `.claude/skills/` where Claude can use it.

**Determinism checklist** — maximize reliability:

- Prefer exact commands over descriptions (`run prettier --write .` not "format the code")
- Prefer scripts over multi-step instructions (reference `scripts/deploy.sh` not 5 prose steps)
- Use explicit values over judgment (`block files > 100KB` not "block large files")
- For high-risk operations (DB migrations, deploys): exact commands, validation steps, rollback plan
- For low-risk operations (code review, docs): general guidelines, let AI use judgment

**One skill = one purpose.** If the skill handles review AND testing AND deployment, split it.

---

## Phase 4: Quality Gates

- [ ] Description contains specific trigger conditions (not process summary)
- [ ] Includes "When NOT to Use" section with explicit exclusions
- [ ] Solution verified to work
- [ ] Specific enough to be actionable
- [ ] General enough to be reusable
- [ ] No sensitive information (API keys, passwords, internal URLs → use env vars instead)
- [ ] No hardcoded paths (use relative paths or environment variables)
- [ ] Deterministic where possible (commands > descriptions)
- [ ] Context-efficient (no explaining what AI already knows)
- [ ] Includes verification step (how to confirm it worked)

---

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| **Kitchen sink** — skill does too many things | One skill = one purpose. Split it. |
| **Vague instructions** — "properly format the code" | Name the specific tool and command |
| **Explaining AI knowledge** — "React is a JavaScript library..." | Only add what AI doesn't know: YOUR conventions |
| **Too many options** — "use pdfplumber, PyMuPDF, or camelot..." | Give one default, mention alternatives only if needed |
| **No verification** — "deploy to staging" (how do you know it worked?) | Always include a verification command |
| **Hardcoded paths** — `/Users/john/projects/my-app/...` | Relative paths or environment variables |

---

## Example

**Scenario:** Discovered LSP `findReferences` can find dead code by checking if functions have only 1 reference (their definition) or only test references.

**Result:** `.claude/skills/my-project-lsp-cleaner/SKILL.md`

```yaml
name: my-project-lsp-cleaner
description: |
  Find dead/unused code using LSP findReferences. Use when: (1) user asks
  to find dead code, (2) cleaning up codebase, (3) refactoring. Key insight:
  function with only 1 reference (definition) or only test refs is dead code.
```
