import RuleToggle from '../ui/RuleToggle'
import ConflictGroup from '../ui/ConflictGroup'
import { groupBySubcategory, SUBCATEGORY_META } from '../../utils/ruleHelpers'

/**
 * Renders a flat list of rule / conflict-group entries grouped into
 * subcategory sections. Shared by Step 1 (Guardrails) and Step 2 (Best Practices).
 *
 * Props: entries, selectedRuleIds (Set), conflictSelections, onToggle, onSelect
 */
export default function RuleSections({
  entries,
  selectedRuleIds,
  conflictSelections,
  onToggle,
  onSelect,
}) {
  const sections = groupBySubcategory(entries)

  return (
    <div className="space-y-8">
      {sections.map(({ subcategory, entries: sectionEntries }) => {
        const meta = SUBCATEGORY_META[subcategory] ?? { title: subcategory, description: '' }
        return (
          <section key={subcategory}>
            <h3 className="text-lg font-semibold text-slate-900">{meta.title}</h3>
            {meta.description && (
              <p className="mb-3 mt-0.5 text-sm text-slate-500">{meta.description}</p>
            )}
            <div className="space-y-3">
              {sectionEntries.map((entry) =>
                entry.type === 'conflict-group' ? (
                  <ConflictGroup
                    key={entry.id}
                    group={entry}
                    selectedOption={conflictSelections[entry.id]}
                    onSelect={onSelect}
                  />
                ) : (
                  <RuleToggle
                    key={entry.id}
                    rule={entry}
                    isSelected={selectedRuleIds.has(entry.id)}
                    onToggle={onToggle}
                  />
                ),
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
