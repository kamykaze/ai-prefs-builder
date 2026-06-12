# Claude Instructions for AI Preferences Builder

## Project Overview

A fully static web wizard that helps anyone generate a personalized AI preferences
text block to paste into Claude, ChatGPT, Gemini, or any AI tool that accepts custom
instructions. The audience is **general users, not just developers** — design and copy
should stay plain-language and approachable.

No backend, no login, no API calls, no data stored anywhere. Stateless per session.
Deployable to GitHub Pages.

**Tech stack:** React (Vite) · Tailwind CSS · single-page wizard (no router) ·
local `useState`/`useReducer` state · static `src/data/rules.json` · npm.

**See also:**

- `ai-prefs-builder-spec.md` — the full product spec: wizard flow, data model, output
  format, component specs, and the complete rule taxonomy. This is the source of truth.
- `README.md` — what it is, how to run locally, how to contribute new rules.

## Todo Management

Use the TodoWrite tool to track tasks and progress, and keep it updated in real-time:

- Mark tasks "in_progress" when starting, "completed" immediately when done.
- Create new todos for any discovered subtasks.

## Handling Ambiguity

- Simple/bounded tasks: execute directly.
- Moderate tasks: brief plan, then implement.
- Complex or ambiguous work: research first, then plan, then implement. Use
  AskUserQuestion for clarification rather than guessing.

## Workflow Rules

- **No commits without explicit approval.** After completing changes, tell the user
  what to test and wait for feedback. Only run `git commit` when they explicitly ask.
  Premature commits make it harder to iterate on fixes.
- **Push back on implementation details.** When the user provides specific
  implementation instructions, don't just execute — ask what the goal is and push back
  if the approach contradicts an established design decision (the spec). The user may be
  thinking out loud; asking "what are you trying to accomplish?" catches mismatches early.
- **Scope searches to project directories.** When using Glob/Grep, exclude generated
  directories (`node_modules/`, `dist/`) to avoid noise. Reading a specific file with
  Read has no restrictions — any file might be needed for troubleshooting.
- **Keep it accessible.** This is for non-technical users. Favor clear copy, obvious
  controls, and accessible markup (labels, keyboard support) over cleverness.

## Documentation

Keep `README.md` and the spec (`ai-prefs-builder-spec.md`) in sync with the code in the
same change — not as a follow-up. When the rule taxonomy changes, update
`src/data/rules.json`; the spec's Data Model section documents its schema.

## Compaction

When compacting context, always preserve: the full list of modified files, any commands
relevant to the current task, and the current plan or task list.
