# AI Preferences Builder

A static web wizard that helps anyone generate a personalized AI preferences text
block to paste into Claude, ChatGPT, Gemini, or any AI tool that accepts custom
instructions. Most people don't know AI behavioral problems (sycophancy, hallucination,
flattery) exist — and those who do rarely know how to fix them in plain language. This
tool lowers that barrier: pick the problems you care about, choose how you want AI to
behave, and copy a ready-to-paste text blob. No account, no tracking, nothing stored.

## Live demo

**[kamykaze.github.io/ai-prefs-builder](https://kamykaze.github.io/ai-prefs-builder/)**

## Run locally

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173/ai-prefs-builder/` URL.

Other scripts:

- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build locally
- `npm run deploy` — build and publish `dist/` to GitHub Pages (via `gh-pages`)

## How it works

The wizard is a single page with five steps:

0. **Context** — optional profile info that filters which best practices you're shown.
1. **Guardrails** — fix common AI behaviors (shown to everyone).
2. **Best Practices** — proactive behaviors tailored to your context.
3. **Custom** — your own free-text rules, appended verbatim.
4. **Output** — the generated, numbered preferences block with a copy button.

On the Output step, long lists get an optional **"Shorten them with AI"** step. Because
the block is a flat numbered list that your AI reads on every turn, a long list of rules
starts to compete for attention. This step hands you a copy-pasteable prompt (plain
instructions plus your own rules) that you run once in Claude, ChatGPT, or Gemini — the AI
merges overlapping rules into a tighter set with the same meaning, which you paste into
your settings instead. The tool never calls an AI itself; it only builds the prompt. The
section auto-expands once your list passes ~15 lines.

As you make selections, a **live preview** of the generated blob updates in real time
(side panel on wide screens, a collapsible panel on mobile) so you can see exactly what's
being added. Your selections are saved in the browser's `localStorage`, so refreshing or
revisiting picks up where you left off — a **"Start over"** control clears everything back
to defaults. There is no backend and nothing is ever uploaded.

## Contributing new rules

All rules live in [`src/data/rules.json`](src/data/rules.json). Each entry is either a
`"rule"` (an on/off card) or a `"conflict-group"` (a set of mutually exclusive radio
options). To add a rule, append an object following the existing schema — the full
schema and field meaning are documented in the **Data Model** section of
[`ai-prefs-builder-spec.md`](ai-prefs-builder-spec.md).

Quick reference:

- `category`: `"guardrail"` (Step 1) or `"best-practice"` (Step 2)
- `subcategory`: groups rules into a section — see `SUBCATEGORY_META` in
  [`src/utils/ruleHelpers.js`](src/utils/ruleHelpers.js) for the known sections
- `tags`: `["universal"]` for guardrails; profession/hobby/use-case slugs (or
  `"general"`) for best practices, which drive the Step 2 filtering
- `default_on`: `true` pre-checks the rule in the wizard
- `aging`: how the rule ages as AI models improve — `preference` (a fact about the user;
  timeless), `counterweight` (fights a persistent training habit like agreeableness;
  doesn't decay), or `patch` (compensates for a model weakness; fades over time). Patches
  also take `patch_status` (`active` or `expiring`) and a plain-language `symptom`. This
  drives the small per-rule pill (explained by a one-time legend above the live preview)
  and the "I'm using a recent AI model" toggle, which tucks away `expiring` patches.
  **`aging` never changes whether a rule is on by default** — that
  stays curated via `default_on`, so a high-consequence patch (fabrication, security)
  stays on. Re-review `patch` tags after each major model release.

## Tech stack

React (Vite) · Tailwind CSS · single-page wizard (no router) · static `rules.json` ·
deployable to GitHub Pages.

## License

MIT
