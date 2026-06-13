import { rules } from '../data/rules.json'

/**
 * Assembles the final preferences text blob from the user's selections.
 *
 * Order (per spec):
 *   1. Selected individual rules (in rules.json order)
 *   2. Conflict-group selections (explicit choice, else default_option, else skip)
 *   3. Custom rules (split by newline, trimmed, empties dropped)
 * The combined list is numbered from 1 and joined with newlines.
 *
 * @param {Object}   selections
 * @param {Set<string>} selections.selectedRuleIds   ids of toggled-on rules
 * @param {Object}   selections.conflictSelections   { [groupId]: optionIndex }
 * @param {string}   selections.customRules           raw textarea string
 * @returns {string} the numbered preferences blob
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

  if (customRules && customRules.trim() !== '') {
    const customLines = customRules
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')
    lines.push(...customLines)
  }

  return lines.map((text, i) => `${i + 1}. ${text}`).join('\n')
}
