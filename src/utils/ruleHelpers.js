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
  'domain-specific': {
    title: 'Domain-specific',
    description: 'Practical defaults for your hobbies and interests.',
  },
}
