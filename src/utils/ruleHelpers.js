import { rules } from '../data/rules.json'

export const TOTAL_STEPS = 5

/** All guardrail entries (rules + conflict-groups), shown to everyone in Step 1. */
export function getGuardrails() {
  return rules.filter((entry) => entry.category === 'guardrail')
}

/**
 * Best-practice entries filtered by the user's Step 0 context (spec Filtering Logic).
 * An entry is shown if it's tagged "general", if the user picked no context at all,
 * or if any of its tags matches one of the user's selected slugs.
 */
export function getBestPracticesForUser(context) {
  const userTags = [
    ...context.professions,
    ...context.hobbies,
    ...context.useCases,
  ]

  return rules.filter((entry) => {
    if (entry.category !== 'best-practice') return false
    if (entry.tags.includes('general')) return true
    if (userTags.length === 0) return true
    return entry.tags.some((tag) => userTags.includes(tag))
  })
}

/**
 * Groups a flat list of entries by `subcategory`, preserving first-seen order.
 * Returns [{ subcategory, entries }] for rendering section-by-section.
 */
export function groupBySubcategory(entries) {
  const order = []
  const map = new Map()
  for (const entry of entries) {
    if (!map.has(entry.subcategory)) {
      map.set(entry.subcategory, [])
      order.push(entry.subcategory)
    }
    map.get(entry.subcategory).push(entry)
  }
  return order.map((subcategory) => ({ subcategory, entries: map.get(subcategory) }))
}

// Aging shows up as a small pill on each rule (see rule-classification-draft.md). We
// never show the raw words "patch/counterweight" — the pill label + the legend above the
// live preview explain what it means. Preferences get no pill.
const COUNTERWEIGHT_TITLE =
  'AIs are trained to please — it shows up as agreement, praise, or filler. This pushes back, and stays worth keeping as models improve.'
const PREFERENCE_TITLE =
  'A personal preference — no AI can infer it, so keep it as long as you want it.'

/** True for a patch that newer models mostly handle (candidate for collapsing). */
export function isExpiringPatch(entry) {
  return (
    entry.type === 'rule' &&
    entry.aging === 'patch' &&
    entry.patch_status === 'expiring'
  )
}

/** Tailwind classes for an aging pill / legend swatch, keyed by tone. */
export function agingPillClasses(tone) {
  switch (tone) {
    case 'counterweight':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'patch-active':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'patch-expiring':
      return 'border-slate-200 bg-slate-100 text-slate-500'
    case 'preference':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-500'
  }
}

// One-time legend describing the pills; rendered above the live preview.
export const AGING_LEGEND = [
  {
    tone: 'counterweight',
    label: 'Always needed',
    description: 'Counters habits AIs keep no matter how much they improve, like agreeing with you.',
  },
  {
    tone: 'patch-active',
    label: 'AI improving',
    description: 'Newer AIs are getting better at this, but not reliably yet.',
  },
  {
    tone: 'patch-expiring',
    label: 'Often handled',
    description: 'Newer AIs usually do this already — add only if you need it.',
  },
  {
    tone: 'preference',
    label: 'Personal',
    description: 'A personal choice no AI can infer — keep it as long as you want it.',
  },
]

/**
 * The aging pill for a rule, or null (conflict-groups get none — they render their own
 * card). `title` is the fuller explanation, surfaced as a hover tooltip.
 * @returns {{ tone: string, label: string, title: string } | null}
 */
export function getAgingPill(entry) {
  if (entry.type !== 'rule') return null
  if (entry.aging === 'counterweight') {
    return { tone: 'counterweight', label: 'Always needed', title: COUNTERWEIGHT_TITLE }
  }
  if (entry.aging === 'patch') {
    const expiring = entry.patch_status === 'expiring'
    return {
      tone: expiring ? 'patch-expiring' : 'patch-active',
      label: expiring ? 'Often handled' : 'AI improving',
      title: entry.symptom ? `Add it if you’re seeing: ${entry.symptom}` : '',
    }
  }
  return { tone: 'preference', label: 'Personal', title: PREFERENCE_TITLE }
}

/** The set of rule ids that should start toggled on (default_on === true). */
export function getDefaultOnRuleIds() {
  return new Set(
    rules
      .filter((entry) => entry.type === 'rule' && entry.default_on)
      .map((entry) => entry.id),
  )
}

/** Human-readable section headings + one-line problem descriptions per subcategory. */
export const SUBCATEGORY_META = {
  // Guardrails
  sycophancy: {
    title: 'AI agrees with you even when you’re wrong',
    description: 'AI agrees with you to keep you happy, not because you’re right.',
  },
  hallucination: {
    title: 'AI makes things up',
    description: 'AI makes up facts rather than admitting it doesn’t know.',
  },
  'emotional-capitulation': {
    title: 'AI backs down when you push',
    description: 'AI backs down when you’re frustrated, even if it was correct.',
  },
  'flattery-filler': {
    title: 'Flattery & filler',
    description: 'AI wastes your time with compliments and boilerplate.',
  },
  // Best practices
  'research-due-diligence': {
    title: 'Research & due diligence',
    description: 'Check what exists before building or recommending something new.',
  },
  'time-data-freshness': {
    title: 'Time & data freshness',
    description: 'Flag when information might be outdated or needs live verification.',
  },
  'professional-precision': {
    title: 'Professional precision',
    description: 'Surface important considerations specific to your field.',
  },
  'learning-teaching': {
    title: 'Learning & teaching',
    description: 'Shape how AI helps you learn, not just get answers.',
  },
  'writing-communication': {
    title: 'Writing & communication',
    description: 'Shape how AI drafts and edits your writing.',
  },
  'domain-specific': {
    title: 'Domain-specific',
    description: 'Practical defaults for your hobbies and interests.',
  },
  'voice-dictation': {
    title: 'Voice & dictation',
    description: 'Tune how AI talks when it’s reading answers out loud.',
  },
}
