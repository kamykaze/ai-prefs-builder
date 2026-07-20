import { rules } from '../data/rules.json'

/**
 * Assembles the final preferences text blob from the user's selections.
 *
 * Order (per spec):
 *   1. Custom rules — the user's own words — as a verbatim block (their line breaks
 *      preserved), NOT split into numbered lines.
 *   2. Selected individual rules (in rules.json order), numbered from 1.
 *   3. Conflict-group selections (explicit choice, else default_option, else skip).
 * Custom rules lead so that if the pasted text ever exceeds a tool's limit and gets
 * truncated at the tail, it's a generic rule that's lost — not the user's own, which
 * they'd immediately notice. This tool is static and can't safely break a
 * multi-sentence instruction into separate rules; the optional "Shorten with AI" step
 * is where a user's model folds custom text into the rest.
 *
 * @param {Object}   selections
 * @param {Set<string>} selections.selectedRuleIds   ids of toggled-on rules
 * @param {Object}   selections.conflictSelections   { [groupId]: optionIndex }
 * @param {string}   selections.customRules           raw textarea string
 * @returns {string} the preferences blob
 */
export function generateOutput({ selectedRuleIds, conflictSelections, customRules }) {
  const lines = []

  for (const entry of rules) {
    if (entry.type === 'rule') {
      if (selectedRuleIds.has(entry.id)) {
        lines.push(entry.rule_text)
      }
    } else if (entry.type === 'conflict-group') {
      let optionIndex
      if (conflictSelections[entry.id] !== undefined) {
        optionIndex = conflictSelections[entry.id]
      } else if (entry.default_option !== undefined) {
        optionIndex = entry.default_option
      } else {
        continue
      }
      const option = entry.options[optionIndex]
      // A "No preference" option has empty rule_text — selecting it emits nothing.
      if (option && option.rule_text.trim() !== '') {
        lines.push(option.rule_text)
      }
    }
  }

  const numbered = lines.map((text, i) => `${i + 1}. ${text}`).join('\n')
  const custom = customRules && customRules.trim() !== '' ? customRules.trim() : ''

  // Custom block first, then a blank line, then the numbered rules.
  return [custom, numbered].filter(Boolean).join('\n\n')
}
