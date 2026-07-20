# Rule classification — patch vs counterweight vs preference (draft from AI-usage audit, 2026-07-19)

Purpose: input for the "rules age with model generations" feature. Three classes, not two —
the honest taxonomy needs a middle category:

- **patch** — compensates for a model weakness. Newer models mostly do this by default; the rule
  decays in value with each generation. UI note: "add only if you're actually seeing this problem."
- **counterweight** — pushes against a *training incentive* (agreeableness, engagement-y praise),
  not a capability gap. Does NOT decay with model intelligence; review per model generation.
- **preference** — a fact about the user (style, values, context). No model can infer it. Timeless.

| id | class | rationale (one line) |
|---|---|---|
| guard-antisyc-facts-first | counterweight | agreement bias is an RLHF incentive, not a capability gap |
| guard-antisyc-assumptions | counterweight | unprompted challenge fights the same incentive |
| guard-antisyc-no-grade-inflate | counterweight | praise inflation is trained-in; persists in frontier models |
| guard-antisyc-hold-ground | counterweight | capitulation-on-pushback is the classic sycophancy failure |
| guard-antisyc-opposing-views | counterweight | one-sided support is agreeableness, not ignorance |
| guard-antisyc-no-apology | patch | excessive apology was an older-model trait; largely gone |
| guard-halluc-admit-uncertainty | patch | much better by default now; add only if observed |
| guard-halluc-ask-when-ambiguous | preference | clarify-vs-best-guess is a style choice, not a fix |
| guard-halluc-confidence-levels | preference | explicit known/inferred/guess labeling is a display style |
| guard-halluc-no-fabrication | patch | heavily trained against; keep only if user sees fabrication |
| guard-halluc-reason-first | patch | reasoning models do this by default — near-zero value now |
| guard-halluc-flag-outdated | patch (not yet expired) | models know cutoffs but still under-volunteer staleness |
| guard-emot-empathy-no-cave | counterweight | emotional capitulation = sycophancy under pressure |
| guard-emot-venting-vs-argument | preference | how the user wants emotion handled is personal |
| guard-emot-no-mirror-framing | counterweight | frame-echoing is agreeableness in disguise |
| guard-flat-no-opener | counterweight | compliment-openers are engagement-trained; still common |
| guard-flat-no-filler | counterweight | same incentive family |
| cg-response-depth | preference | conflict group — pure style |
| cg-feedback-style | preference | conflict group — pure style |
| bp-research-before-build | preference | a work value (buy-vs-build discipline), not a fix |
| bp-prefer-standard-solutions | preference | engineering values |
| bp-suggest-alternatives | preference | decision style |
| bp-check-availability | patch (not yet expired) | search-enabled models improving, still miss it |
| bp-verify-live-data | patch (not yet expired) | same |
| bp-check-relative-time | patch | date-aware surfaces handle this; skills can own it |
| bp-flag-stale-apis | patch (not yet expired) | training cutoffs persist; still earns its place for devs |
| bp-flag-policy-changes | patch (not yet expired) | models increasingly caveat, still inconsistently |
| bp-flag-security | patch (aging) | frontier models increasingly flag unprompted; keep for devs |
| bp-question-methodology | preference | analytical-rigor style |
| bp-accessibility | preference | a value the user holds |
| bp-steelman | preference | decision-handling style (with counterweight flavor) |
| bp-name-financial-assumptions | preference | rigor style |
| bp-flag-legal-jurisdiction | patch | models now over-do jurisdiction caveats if anything |
| bp-explain-the-why | preference | learning style |
| bp-learn-summarize-new | preference | learning style |
| cg-learning-mode | preference | conflict group — pure style |
| bp-write-own-voice | preference | personal, timeless |
| bp-write-plain-language | preference | personal, timeless |
| bp-recipe-substitutions | preference | personal |
| bp-fitness-form-safety | preference | safety-emphasis value |
| bp-travel-advisories | preference | personal |
| bp-health-cite-sources | preference | epistemic style |
| bp-voice-concise | preference | context style |
| bp-voice-flag-text | preference | context style |
| bp-voice-no-symbols | patch | voice/TTS layers increasingly strip formatting themselves |

Tally: 10 counterweight · 11 patch (5 marked "not yet expired") · 24 preference.

Suggested product behavior:
- preference → recommend freely; never warn about age.
- counterweight → recommend; copy explains it fights a persistent incentive, not a capability gap.
- patch → default OFF (or "only if you're seeing this"), with plain-language symptom description
  so users self-diagnose; revisit tags per major model generation.
- Classification is a judgment call per rule — treat this table as a reviewed draft, not ground truth.
