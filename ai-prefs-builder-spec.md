# AI Preferences Builder — Project Spec

## Overview

A static web wizard that helps anyone generate a personalized AI preferences text block they can paste into Claude, ChatGPT, Gemini, or any AI tool that accepts custom instructions.

Most people don't know AI behavioral problems exist, and even those who do don't know how to address them in plain language. This tool lowers that barrier. Users pick what problems they care about, select rules, and get a ready-to-paste text blob.

**Audience:** General users — not just developers. Think non-technical users who want better AI behavior without learning prompt engineering. Design and copy should reflect that.

**Platform:** Fully static. No backend, no login, no server-side storage. Selections are
persisted to the browser's `localStorage` so a returning user resumes their work; nothing
is ever uploaded. Deployable to GitHub Pages.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| Routing | None — single-page wizard |
| State | useState / useReducer (local only) |
| Data | `/src/data/rules.json` (static file) |
| Deployment | GitHub Pages |
| Package manager | npm |

No backend. No API calls. Wizard selections are saved to `localStorage` (browser-only)
so progress survives a refresh or revisit; a "Start over" control clears them back to
defaults.

---

## Repository Structure

```
ai-prefs-builder/
├── public/
│   └── favicon.ico
├── src/
│   ├── data/
│   │   └── rules.json          # Full rule taxonomy (see Data Model section)
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── Step0_Context.jsx      # Personal context: profession, hobbies, use cases
│   │   │   ├── Step1_Guardrails.jsx   # Behavioral guardrails + conflict groups
│   │   │   ├── Step2_BestPractices.jsx # Filtered best practices
│   │   │   ├── Step3_Custom.jsx       # Free-text custom rules
│   │   │   └── Step4_Output.jsx       # Preview + copy output
│   │   ├── ui/
│   │   │   ├── RuleToggle.jsx         # Individual on/off rule card
│   │   │   ├── ConflictGroup.jsx      # Radio-button group for mutually exclusive rules
│   │   │   ├── StepIndicator.jsx      # Progress bar / step dots at top
│   │   │   └── CopyButton.jsx         # Copy-to-clipboard with confirmation state
│   │   └── WizardShell.jsx            # Layout wrapper: step indicator + nav buttons
│   ├── hooks/
│   │   └── useWizardState.js          # Central state + output generation logic
│   ├── utils/
│   │   └── generateOutput.js          # Assembles final text blob from selections
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Wizard Flow

### Step 0 — Personal Context
*"Tell us a little about how you use AI"*

Used to filter which Best Practices are shown in Step 2. Does not generate any rules itself.

**Fields:**

| Field | UI Type | Options |
|---|---|---|
| Profession | Multi-select chips | Developer · Designer · Writer / Content Creator · Researcher / Academic · Business / Manager · Marketer · Healthcare · Legal · Finance · Educator · Student · General / Casual |
| Hobbies & interests | Multi-select chips | DIY / Maker · Cooking · Fitness · Travel · Photography · Music · Gaming · Sports · Reading · Technology |
| Primary AI use cases | Multi-select chips | Coding · Research · Writing & editing · Planning & decisions · Learning · Creative work · General Q&A · Professional tasks |

**Behavior:**
- All fields optional. If nothing is selected, Step 2 shows all best practices (unfiltered).
- Selections persist in wizard state for use in Step 2 tag filtering.
- "Skip" option available to jump past this step.

---

### Step 1 — Guardrails
*"Pick the AI behaviors you want to fix"*

Shown to everyone regardless of Step 0 selections. Organized into subcategory sections with a short plain-English description of each problem area.

**Layout per subcategory:**
- Section heading (e.g., "AI agrees with you even when you're wrong")
- 1-sentence problem description
- List of `RuleToggle` components (individual rules)
- `ConflictGroup` components where applicable (rendered as radio button group instead of toggles)

**Subcategories:**

1. **Sycophancy** — *"AI agrees with you to keep you happy, not because you're right"*
2. **Hallucination** — *"AI makes up facts rather than admitting it doesn't know"*
3. **Emotional capitulation** — *"AI backs down when you're frustrated, even if it was correct"*
4. **Flattery & filler** — *"AI wastes your time with compliments and boilerplate"*

**Conflict Groups in this step:**

- **Response depth** (radio): Concise · Balanced · Thorough
- **Feedback style** (radio): Direct · Balanced · Gentle

Default-on rules are pre-checked. Users can uncheck anything.

**Rule aging (Steps 1 & 2).** Each rule card carries a small **pill** based on its `aging`
class — `counterweight` → "Always needed" (green), `patch · active` → "AI improving"
(amber), `patch · expiring` → "Often handled" (grey), `preference` → "Personal" (blue).
The fuller explanation / `symptom` is the pill's hover tooltip, and a one-time **legend**
in its own collapsible section (open by default) above the live preview — rule-picking
steps only — explains what the pills mean, so the user reads it once instead of a sentence
on every card. See `AgingLegend.jsx`. A **"I'm using a recent AI model"** toggle
(default on, `modernModel` state) renders **only on Step 1** to avoid duplication, but its
effect applies to Steps 1 and 2 alike — when on, `expiring` patches the user hasn't
selected are tucked into a per-section "N rules newer AIs usually handle — show anyway"
disclosure. The toggle only changes visibility, never selections or output. See
`getAgingPill` / `agingPillClasses` / `AGING_LEGEND` / `isExpiringPatch` in
`src/utils/ruleHelpers.js`.

---

### Step 2 — Best Practices
*"Add proactive behaviors that fit how you work"*

Filtered by tags from Step 0. Only shows rules where at least one of the user's selected professions, hobbies, or use cases matches a rule's `tags` array — OR where `tags` includes `"general"`.

If the user skipped Step 0, show all best practices.

**Layout:** Same as Step 1 — subcategory sections with `RuleToggle` cards.

**Subcategories:**

1. **Research & due diligence** — *"Check what exists before building or recommending something new"*
2. **Time & data freshness** — *"Flag when information might be outdated or needs live verification"*
3. **Professional precision** — *"Surface important considerations specific to your field"*
4. **Learning & teaching** — *"Shape how AI helps you learn, not just get answers"*
5. **Writing & communication** — *"Shape how AI drafts and edits your writing"* (tagged `general`/`writer`, all opt-in)
6. **Domain-specific** — *"Practical defaults for your hobbies and interests"*
7. **Voice & dictation** — *"Tune how AI talks when it's reading answers out loud"* (tagged `general`, all opt-in)

> Note: `src/data/rules.json` is the canonical rule taxonomy and may have grown beyond the
> seed JSON in the "Full Rule Data" section below. The schema there still applies.

**Conflict Group in this step:**

- **Learning mode** (radio, only shown if student/educator/general tags match): Just give me the answer · Guide me to reason through it · Socratic — ask me questions

---

### Step 3 — Custom Rules
*"Anything else? Add your own rules."*

A plain `<textarea>` where users can type additional instructions — or a few facts about
themselves that help AI respond the way they want (e.g. "I'm a non-native English speaker").
This text is placed at the **top** of the output blob **verbatim as one block** —
deliberately *not* parsed or split into per-line rules. It leads (rather than trailing the
generated rules) so that if the pasted text exceeds a tool's character limit and gets
truncated, the user's own words survive and a generic rule is lost instead. A static tool
can't reliably merge free-form text with the generated rules; if a user's list is long, the
optional "Shorten with AI" step (Step 4) hands the whole blob — custom text included — to
their own AI, which folds everything together (and is told to keep the personal notes first
and intact). So custom rules always work: verbatim by default, merged only if the user
chooses to run the compaction prompt.

- Placeholder text: *"e.g. I'm a non-native English speaker, so keep wording simple. Always respond in metric units. I use TickTick for my to-do lists."*
- Character counter (soft limit guidance, not enforced — different AI tools have different limits)
- No validation — free-form

---

### Step 4 — Output
*"Your preferences are ready"*

**Layout:**
- Heading: "Here are your AI preferences"
- Subtext: "Copy and paste this into your AI tool's settings. Works with Claude, ChatGPT, Gemini, and most others."
- Read-only `<textarea>` or styled `<pre>` block showing the full generated text
- **Copy to clipboard** button (shows "Copied!" confirmation for 2 seconds)
- **Start over** button (resets all state, returns to Step 0)
- Collapsible section: **"Too many rules? Shorten them with AI (optional)"** — a
  compaction step for long lists. The output is a flat numbered list where every line is
  read on every turn, so past ~15 lines related rules start to compete for attention. This
  section shows a copy-pasteable *meta-prompt* (fixed plain-language instructions +
  the user's generated blob) that the user runs once in Claude/ChatGPT/Gemini; the AI
  merges related rules into a tighter set with the same meaning, which the user pastes into
  their settings instead. No backend or API call — the tool only hands over the prompt.
  The prompt tells the AI to merge overlapping rules, keep every intent, preserve the
  user's conflict-group choices (don't reintroduce alternatives), keep any personal notes
  first and intact, return the result in a code block (so numbers survive copy), and target
  ≤15 lines. It deliberately does *not* impose a character target (that fights the line
  goal); instead the section carries a plain note to check the result and trim if it's
  still over ChatGPT's ~1,500-char limit.
  Collapsed by default; **auto-expands** once the blob exceeds `COMPACTION_LINE_THRESHOLD`
  (15) lines, and the section is styled with an amber tint in that state. See
  `src/utils/compactionPrompt.js`.
- Collapsible section: "Where do I paste this?" with platform-specific instructions:
  - Claude: Settings → Profile → "What preferences should Claude consider?"
  - ChatGPT: Click profile → Custom Instructions → "How would you like ChatGPT to respond?"
  - Gemini: Settings → "Your instructions for Gemini"

---

## Output Format

Custom rules from Step 3 come **first**, as a verbatim block (not split into numbered
lines — see Step 3 rationale), then a blank line, then the generated rules as a flat
numbered list — one rule per line, no section headers, no markdown. Custom rules lead so
that if the pasted text exceeds a tool's limit and is truncated at the tail, a generic
rule is lost rather than the user's own (which they'd immediately notice).

**Example output:**
```
I'm a non-native English speaker, so keep wording simple. Always respond in metric
units. I use TickTick for my to-do lists.

1. Prioritize factual accuracy over agreement. Correct me even if I seem confident.
2. If you're unsure, say "I don't know" or "I'm uncertain because..." — don't fill gaps.
3. Never invent citations, statistics, product names, or examples. If you can't verify it, say so.
4. Don't start responses with compliments or affirmations. Get to the point.
5. Keep responses concise. If the answer is short, keep it short. Don't pad.
6. Before suggesting I build something custom, check if an existing tool already solves it.
```

---

## State Shape

```js
{
  // Step 0
  context: {
    professions: [],      // string[] of selected profession slugs
    hobbies: [],          // string[] of selected hobby slugs
    useCases: [],         // string[] of selected use case slugs
  },

  // Step 1 + 2
  selectedRuleIds: Set(), // IDs of toggled-on individual rules

  // Conflict group selections (Step 1 + 2)
  conflictSelections: {}, // { [groupId]: optionIndex (0-based) }

  // Step 3
  customRules: "",        // raw string from textarea

  // Step 1 + 2 display: "I'm using a recent AI model" toggle. When true, expiring
  // patches are tucked behind a per-section disclosure. Display-only — never
  // affects selections or output. Defaults true.
  modernModel: true,

  // Navigation
  currentStep: 0,         // 0–4
}
```

---

## Output Generation Logic (`generateOutput.js`)

```
1. Start with empty array of rule strings.

2. For each rule in rules.json where type === "rule":
   - If rule.id is in selectedRuleIds → add rule.rule_text to array

3. For each group in rules.json where type === "conflict-group":
   - If conflictSelections[group.id] is defined → add the chosen option's rule_text
   - If not defined AND group has a default_option → add that option's rule_text
   - Otherwise → skip

4. Number the rule array starting at 1, joined with newlines.

5. If customRules is not empty:
   - Trim outer whitespace but keep the user's internal line breaks
   - Keep it as a single verbatim block — do NOT split into numbered lines (a static tool
     can't safely break a multi-sentence instruction into separate rules; the optional
     "Shorten with AI" step is where a model folds it in)

6. Join the custom block (first) and the numbered rules with a blank line between, and
   return. Custom leads so a tail-truncated paste loses a generic rule, not the user's own.
```

---

## Data Model (`rules.json`)

Two types of entries: `"rule"` and `"conflict-group"`.

### Rule schema:
```json
{
  "id": "string (unique slug)",
  "type": "rule",
  "category": "guardrail | best-practice",
  "subcategory": "string",
  "label": "Short display name for UI",
  "description": "One sentence — what problem does this fix?",
  "rule_text": "The actual instruction text that goes into the output blob.",
  "tags": ["universal"] ,
  "default_on": true,
  "aging": "patch | counterweight | preference",
  "patch_status": "active | expiring",
  "symptom": "plain-language symptom (patches only)"
}
```

- `tags`: Use `["universal"]` for guardrails shown to everyone. For best practices, use profession/hobby slugs: `["developer", "designer", "maker"]`
- `default_on`: `true` means pre-checked in the wizard
- `aging`: how the rule ages across model generations (see below). Required on every rule
  and conflict-group.
  - `patch` — compensates for a model weakness; loses value as models improve. The UI
    shows a plain "newer AIs are getting better at this…" note plus the `symptom`.
  - `counterweight` — pushes against a persistent training incentive (agreeableness,
    praise, filler), not a capability gap. Does **not** decay; UI shows a "still worth
    keeping" note.
  - `preference` — a fact about the user (style, values, context) no model can infer.
    Timeless; no age note shown.
- `patch_status` (patches only): `active` = model still needs it or the rule is
  high-consequence (kept on); `expiring` = newer models mostly handle it (tucked behind
  the "recent AI model" disclosure by default). Omit for counterweight/preference.
- `symptom` (patches only): a short, non-technical description of what the user would
  observe if they need the rule — powers the "Add it if you're seeing: …" copy.

> **`aging` is orthogonal to `default_on`.** The class drives *copy and visibility*, never
> the on/off default. High-consequence patches (fabricated sources, unflagged security,
> made-up answers) are tagged `patch` + `active` and stay on — the aging tag must never
> silently disarm a safety rule. Re-review `patch` tags per major model release.

### Conflict-group schema:
```json
{
  "id": "string (unique slug)",
  "type": "conflict-group",
  "category": "guardrail | best-practice",
  "subcategory": "string",
  "label": "Question shown to user (e.g. 'How detailed should responses be?')",
  "description": "One sentence explaining what this choice affects.",
  "tags": ["universal"],
  "aging": "preference",
  "default_option": 1,
  "options": [
    {
      "label": "Short option name",
      "description": "What this option means in plain English",
      "rule_text": "The instruction text for this option."
    }
  ]
}
```

Conflict groups carry `aging` too (all current ones are `preference` — a choice
between styles doesn't age). They never take `patch_status`/`symptom`.

---

## Full Rule Data

Paste the following as the content of `src/data/rules.json`:

```json
{
  "rules": [

    // ─── GUARDRAILS: Anti-Sycophancy ───────────────────────────────────────

    {
      "id": "guard-antisyc-facts-first",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "Prioritize facts over agreement",
      "description": "AI will correct you even when you seem confident.",
      "rule_text": "Prioritize factual accuracy over agreement. Correct me even if I seem confident.",
      "tags": ["universal"],
      "default_on": true
    },
    {
      "id": "guard-antisyc-assumptions",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "Call out my assumptions",
      "description": "AI flags errors or hidden assumptions in your thinking.",
      "rule_text": "Point out errors or unchecked assumptions in my thinking, even if I didn't ask.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-antisyc-no-grade-inflate",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "No grade inflation",
      "description": "AI gives honest assessments of your work, not inflated praise.",
      "rule_text": "When I ask you to assess my work, be critical and honest. Don't inflate quality to spare my feelings.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-antisyc-hold-ground",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "Hold your ground",
      "description": "AI won't reverse its position just because you push back emotionally.",
      "rule_text": "If I push back on your answer, don't change your position unless I give a logical or factual reason. Acknowledge my disagreement, but hold your ground if the facts support it.",
      "tags": ["universal"],
      "default_on": true
    },
    {
      "id": "guard-antisyc-opposing-views",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "Offer opposing views",
      "description": "AI presents viewpoints that challenge your position, not just ones that support it.",
      "rule_text": "On disputed topics, offer viewpoints that challenge my position, not just ones that support it.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-antisyc-no-apology",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "No excessive apology",
      "description": "AI doesn't over-apologize when correcting or disagreeing with you.",
      "rule_text": "Don't apologize excessively when you disagree with me or correct me. Acknowledge it briefly and move on.",
      "tags": ["universal"],
      "default_on": false
    },

    // ─── GUARDRAILS: Anti-Hallucination ────────────────────────────────────

    {
      "id": "guard-halluc-admit-uncertainty",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "hallucination",
      "label": "Admit uncertainty clearly",
      "description": "AI says 'I don't know' instead of filling gaps with guesses.",
      "rule_text": "If you're unsure, say \"I don't know\" or \"I'm uncertain because...\" — don't fill gaps with assumptions.",
      "tags": ["universal"],
      "default_on": true
    },
    {
      "id": "guard-halluc-confidence-levels",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "hallucination",
      "label": "Signal confidence levels",
      "description": "AI distinguishes between things it knows, infers, and speculates about.",
      "rule_text": "Distinguish between things you know with confidence, things you're inferring, and things you're speculating about.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-halluc-no-fabrication",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "hallucination",
      "label": "No fabricated sources",
      "description": "AI never invents citations, statistics, or examples.",
      "rule_text": "Never invent citations, statistics, product names, or examples. If you can't verify it, say so.",
      "tags": ["universal"],
      "default_on": true
    },
    {
      "id": "guard-halluc-reason-first",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "hallucination",
      "label": "Reason before concluding",
      "description": "AI works through complex problems step by step before giving an answer.",
      "rule_text": "For complex questions, reason through the steps before reaching a conclusion. Don't jump to an answer.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-halluc-flag-outdated",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "hallucination",
      "label": "Flag potentially outdated info",
      "description": "AI warns you when the information it's sharing might no longer be current.",
      "rule_text": "If information you're sharing might be outdated, say so proactively before I have to ask.",
      "tags": ["universal"],
      "default_on": true
    },

    // ─── GUARDRAILS: Emotional Capitulation ────────────────────────────────

    {
      "id": "guard-emot-empathy-no-cave",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "emotional-capitulation",
      "label": "Empathy without capitulation",
      "description": "AI can acknowledge your feelings without agreeing with your conclusions.",
      "rule_text": "You can acknowledge my feelings without agreeing with my conclusions. Empathy and accuracy are not the same thing.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-emot-venting-vs-argument",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "emotional-capitulation",
      "label": "Distinguish venting from argument",
      "description": "AI checks whether you're frustrated or making a logical point before responding differently.",
      "rule_text": "If I seem frustrated or upset, check whether I'm venting or making a logical argument before adjusting your position.",
      "tags": ["universal"],
      "default_on": false
    },
    {
      "id": "guard-emot-no-mirror-framing",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "emotional-capitulation",
      "label": "Don't mirror my framing",
      "description": "AI won't echo your framing back as if it's validated fact.",
      "rule_text": "Don't echo my framing back as if it's validated fact. If my question contains a hidden assumption, point it out.",
      "tags": ["universal"],
      "default_on": false
    },

    // ─── GUARDRAILS: Flattery & Filler ─────────────────────────────────────

    {
      "id": "guard-flat-no-opener",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "flattery-filler",
      "label": "Skip the opener",
      "description": "AI gets to the point instead of opening with compliments or scene-setting.",
      "rule_text": "Don't start responses with compliments, affirmations, or scene-setting. Get to the point.",
      "tags": ["universal"],
      "default_on": true
    },
    {
      "id": "guard-flat-no-filler",
      "type": "rule",
      "category": "guardrail",
      "subcategory": "flattery-filler",
      "label": "No filler phrases",
      "description": "AI avoids hollow filler like 'Great question!' or 'Certainly!'",
      "rule_text": "Avoid filler phrases like \"Great question!\", \"Certainly!\", \"Absolutely!\", and \"Of course!\"",
      "tags": ["universal"],
      "default_on": true
    },

    // ─── GUARDRAILS: Conflict Groups ───────────────────────────────────────

    {
      "id": "cg-response-depth",
      "type": "conflict-group",
      "category": "guardrail",
      "subcategory": "flattery-filler",
      "label": "How detailed should responses be?",
      "description": "Controls how much explanation AI adds by default.",
      "tags": ["universal"],
      "default_option": 0,
      "options": [
        {
          "label": "Concise",
          "description": "Get to the point. Short answers are better.",
          "rule_text": "Keep responses concise. If the answer is short, keep it short. Don't pad."
        },
        {
          "label": "Balanced",
          "description": "Brief by default, but explain reasoning when the topic is complex.",
          "rule_text": "Be concise by default, but explain your reasoning when the topic is complex or the decision has significant consequences."
        },
        {
          "label": "Thorough",
          "description": "Always explain the reasoning, not just the answer.",
          "rule_text": "Always explain the reasoning behind answers, not just the conclusion."
        }
      ]
    },
    {
      "id": "cg-feedback-style",
      "type": "conflict-group",
      "category": "guardrail",
      "subcategory": "sycophancy",
      "label": "How should feedback on my work be delivered?",
      "description": "Controls how AI frames criticism when reviewing your writing, code, plans, etc.",
      "tags": ["universal"],
      "default_option": 0,
      "options": [
        {
          "label": "Direct",
          "description": "Lead with problems. I can handle it.",
          "rule_text": "When giving feedback on my work, lead with the problems. Don't soften criticism with excessive praise first."
        },
        {
          "label": "Balanced",
          "description": "Acknowledge strengths, then get to the problems.",
          "rule_text": "When giving feedback on my work, briefly acknowledge what works well before covering the problems."
        },
        {
          "label": "Gentle",
          "description": "Soften criticism. I'm sensitive to blunt feedback.",
          "rule_text": "When giving feedback on my work, be encouraging and frame problems as opportunities to improve."
        }
      ]
    },

    // ─── BEST PRACTICES: Research & Due Diligence ──────────────────────────

    {
      "id": "bp-research-before-build",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "research-due-diligence",
      "label": "Research before building",
      "description": "AI checks if existing tools solve the problem before suggesting you build something new.",
      "rule_text": "Before suggesting I build something custom, check whether an existing tool, library, or service already solves the problem.",
      "tags": ["developer", "designer", "maker"],
      "default_on": false
    },
    {
      "id": "bp-prefer-standard-solutions",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "research-due-diligence",
      "label": "Prefer standard solutions in code",
      "description": "AI uses built-in language or library functions before writing custom logic.",
      "rule_text": "When helping with code, prefer standard library functions or well-maintained packages over writing custom logic from scratch.",
      "tags": ["developer"],
      "default_on": false
    },
    {
      "id": "bp-suggest-alternatives",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "research-due-diligence",
      "label": "Suggest alternatives before recommending one solution",
      "description": "AI mentions 2–3 approaches before committing to one recommendation.",
      "rule_text": "When I describe a problem, briefly mention 2–3 existing approaches before recommending one.",
      "tags": ["developer", "researcher", "business", "manager"],
      "default_on": false
    },
    {
      "id": "bp-check-availability",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "research-due-diligence",
      "label": "Note when availability should be verified",
      "description": "AI flags when a product, tool, or service should be checked for current availability.",
      "rule_text": "When recommending a product, tool, or service, note that pricing and availability should be verified from a current source.",
      "tags": ["general", "business", "finance"],
      "default_on": false
    },

    // ─── BEST PRACTICES: Time & Data Freshness ─────────────────────────────

    {
      "id": "bp-verify-live-data",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "time-data-freshness",
      "label": "Flag fast-changing data",
      "description": "AI notes when prices, rates, or availability should be verified from a live source.",
      "rule_text": "For prices, interest rates, availability, or other fast-changing data, note that your training data may be outdated and recommend checking a live source.",
      "tags": ["finance", "business", "general", "developer"],
      "default_on": false
    },
    {
      "id": "bp-check-relative-time",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "time-data-freshness",
      "label": "Check current date for relative time references",
      "description": "AI doesn't guess what 'today', 'this week', or 'recently' means without knowing the actual date.",
      "rule_text": "When I use relative time references like \"today\", \"this week\", or \"recently\", verify or ask for the current date before answering.",
      "tags": ["general"],
      "default_on": true
    },
    {
      "id": "bp-flag-stale-apis",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "time-data-freshness",
      "label": "Flag potentially stale API or library docs",
      "description": "AI warns you when code it suggests uses APIs or libraries that may have changed.",
      "rule_text": "When suggesting code that uses a specific API, library, or framework version, flag that the interface may have changed since your training data.",
      "tags": ["developer"],
      "default_on": false
    },
    {
      "id": "bp-flag-policy-changes",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "time-data-freshness",
      "label": "Flag medical/legal/financial policy changes",
      "description": "AI reminds you that guidelines and regulations change and recommends checking current sources.",
      "rule_text": "For medical, legal, or financial information, note that guidelines and regulations change and recommend verifying with a current authoritative source or professional.",
      "tags": ["healthcare", "legal", "finance", "general"],
      "default_on": false
    },

    // ─── BEST PRACTICES: Professional Precision ────────────────────────────

    {
      "id": "bp-flag-security",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Flag security issues in code",
      "description": "AI points out security vulnerabilities even when you didn't ask about security.",
      "rule_text": "When reviewing or writing code, flag security vulnerabilities even if I didn't ask about security.",
      "tags": ["developer"],
      "default_on": false
    },
    {
      "id": "bp-question-methodology",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Question data methodology",
      "description": "AI flags concerns about sample size, methodology, or data quality in analysis.",
      "rule_text": "When helping with data analysis or research, flag concerns about sample size, methodology, or data quality even if I didn't ask.",
      "tags": ["researcher", "academic", "developer"],
      "default_on": false
    },
    {
      "id": "bp-accessibility",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Include accessibility in design feedback",
      "description": "AI raises accessibility considerations when reviewing or suggesting UI/design work.",
      "rule_text": "When giving design feedback or writing UI code, include accessibility considerations even if I didn't ask.",
      "tags": ["designer", "developer"],
      "default_on": false
    },
    {
      "id": "bp-steelman",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Steelman the opposition",
      "description": "AI presents the strongest counterargument before you commit to a plan or decision.",
      "rule_text": "When I present a plan, argument, or decision, tell me the strongest counterargument or what could go wrong before I commit.",
      "tags": ["business", "manager", "researcher", "writer", "general"],
      "default_on": false
    },
    {
      "id": "bp-name-financial-assumptions",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Name assumptions in financial calculations",
      "description": "AI explicitly states the assumptions that affect financial projections or calculations.",
      "rule_text": "When helping with financial calculations or projections, explicitly name the assumptions that affect the result.",
      "tags": ["finance", "business"],
      "default_on": false
    },
    {
      "id": "bp-flag-legal-jurisdiction",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "professional-precision",
      "label": "Flag legal jurisdiction differences",
      "description": "AI notes that laws vary by location and recommends professional advice for legal matters.",
      "rule_text": "When discussing legal topics, note that laws vary by jurisdiction and recommend consulting a qualified professional.",
      "tags": ["legal", "general"],
      "default_on": false
    },

    // ─── BEST PRACTICES: Learning & Teaching ───────────────────────────────

    {
      "id": "bp-explain-the-why",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "learning-teaching",
      "label": "Explain the why, not just the how",
      "description": "AI explains the reasoning behind concepts, not just the steps.",
      "rule_text": "When teaching a concept or explaining how something works, explain why it works that way, not just the steps.",
      "tags": ["educator", "student", "developer", "general"],
      "default_on": false
    },

    {
      "id": "cg-learning-mode",
      "type": "conflict-group",
      "category": "best-practice",
      "subcategory": "learning-teaching",
      "label": "When I'm learning something, how should AI respond?",
      "description": "Controls whether AI gives you answers or helps you work them out yourself.",
      "tags": ["student", "educator", "general"],
      "default_option": 0,
      "options": [
        {
          "label": "Just answer",
          "description": "Give me the answer directly.",
          "rule_text": "When I'm learning something new, give me clear direct answers."
        },
        {
          "label": "Guide me",
          "description": "Help me reason through it before giving the answer.",
          "rule_text": "When I'm learning something, guide me to reason through it before giving the answer. Prompt my thinking."
        },
        {
          "label": "Socratic",
          "description": "Mostly ask questions and let me work it out.",
          "rule_text": "When I'm learning, use a Socratic approach — ask questions and let me work through the reasoning. Give direct answers only when I'm stuck."
        }
      ]
    },

    // ─── BEST PRACTICES: Domain-Specific ───────────────────────────────────

    {
      "id": "bp-recipe-substitutions",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "domain-specific",
      "label": "Suggest recipe substitutions",
      "description": "AI proactively mentions common substitutions for dietary restrictions.",
      "rule_text": "When helping with recipes, proactively suggest common substitutions for dietary restrictions even if I didn't ask.",
      "tags": ["cooking"],
      "default_on": false
    },
    {
      "id": "bp-fitness-form-safety",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "domain-specific",
      "label": "Include form cues and injury risk",
      "description": "AI adds form guidance and injury notes when suggesting exercises.",
      "rule_text": "When suggesting exercises or training plans, include form cues and note injury risks.",
      "tags": ["fitness"],
      "default_on": false
    },
    {
      "id": "bp-travel-advisories",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "domain-specific",
      "label": "Proactive travel advisories",
      "description": "AI flags visa requirements, safety advisories, and local customs when helping with travel.",
      "rule_text": "When helping with travel planning, proactively mention visa requirements, safety advisories, and relevant local customs.",
      "tags": ["travel"],
      "default_on": false
    },
    {
      "id": "bp-health-cite-sources",
      "type": "rule",
      "category": "best-practice",
      "subcategory": "domain-specific",
      "label": "Distinguish health science from trends",
      "description": "AI separates established research from popular but unverified health claims.",
      "rule_text": "When discussing nutrition, fitness, or health, distinguish between established science and trending opinion or anecdotal claims.",
      "tags": ["fitness", "healthcare", "general"],
      "default_on": false
    }

  ]
}
```

---

## Component Specs

### `WizardShell.jsx`
- Renders `StepIndicator` at the top (5 dots or numbered steps)
- Renders the current step component in the center
- Renders Back / Next / Generate buttons at the bottom
- "Next" is always enabled (all steps are optional — user can proceed without selecting anything)
- "Generate" button appears on Step 3, navigates to Step 4

### `RuleToggle.jsx`
Props: `rule`, `isSelected`, `onToggle`
- Card layout: label (bold), description (small/muted), toggle switch or checkbox
- Highlight state when selected
- Pre-checked if `rule.default_on === true`

### `ConflictGroup.jsx`
Props: `group`, `selectedOption`, `onSelect`
- Renders group `label` as heading
- Renders each option as a radio card: option label + description
- Highlights selected option
- Uses `group.default_option` as initial selection

### `StepIndicator.jsx`
Props: `currentStep`, `totalSteps`
- Shows 5 steps. Filled/active = current, filled = completed, empty = upcoming
- Clicking a completed step navigates back (optional, nice-to-have)

### `CopyButton.jsx`
Props: `text`
- Calls `navigator.clipboard.writeText(text)`
- Shows "Copy" by default, switches to "Copied ✓" for 2 seconds after success
- Falls back to selecting the textarea text if clipboard API unavailable

### `useWizardState.js`
- Holds all wizard state (see State Shape above)
- Exports: `state`, `setContext`, `toggleRule`, `setConflictSelection`, `setCustomRules`, `setStep`, `generateOutput`
- `generateOutput` implements the output generation logic described above

---

## Filtering Logic (Step 2)

```js
function getRulesForUser(allRules, context) {
  const userTags = [
    ...context.professions,
    ...context.hobbies,
    ...context.useCases
  ];

  return allRules.filter(rule => {
    if (rule.category !== "best-practice") return false;
    if (rule.tags.includes("general")) return true;
    if (userTags.length === 0) return true; // show all if no context
    return rule.tags.some(tag => userTags.includes(tag));
  });
}
```

---

## Deployment (GitHub Pages)

In `vite.config.js`, set the `base` to your repo name:
```js
export default {
  base: '/ai-prefs-builder/',
}
```

Add a deploy script to `package.json`:
```json
"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}
```

Install `gh-pages` as a dev dependency. Push to `main`, run `npm run deploy`.

---

## Out of Scope for v1

- User accounts or server-side saved preferences (local browser persistence is in v1)
- Sharing a configuration via URL (nice v2 feature — encode state in URL params)
- Community-submitted rules
- Conflict detection between custom rules and selected rules
- Dark mode (can be added later with Tailwind's `dark:` classes)
- Localization / non-English UI

---

## Suggested Repo Name

`ai-prefs-builder` — short, descriptive, platform-agnostic.

Or if you want something more brandable: `prefwise`, `ai-ruleset`, `promptrules`.

---

## README Notes for Repo

The README should cover:
1. What this is and why it exists (one paragraph)
2. Live demo link (GitHub Pages URL)
3. How to contribute new rules (point to `rules.json` schema)
4. How to run locally (`npm install && npm run dev`)
5. License (suggest MIT)
