import RuleToggle from '../ui/RuleToggle'
import ConflictGroup from '../ui/ConflictGroup'
import {
  groupBySubcategory,
  isExpiringPatch,
  SUBCATEGORY_META,
} from '../../utils/ruleHelpers'

/**
 * Renders a flat list of rule / conflict-group entries grouped into
 * subcategory sections. Shared by Step 1 (Guardrails) and Step 2 (Best Practices).
 *
 * When `modernModel` is on, rules newer models mostly handle on their own
 * (expiring patches) are tucked into a per-section disclosure — unless the user
 * has already selected one, in which case it stays inline so nothing is hidden
 * out from under a selection.
 *
 * `modernModel` still governs collapsing on every step it's used, but the toggle
 * *control* only renders where `showModernToggle` is set (Step 1) so it isn't duplicated.
 *
 * Props: entries, selectedRuleIds (Set), conflictSelections, onToggle, onSelect,
 *        modernModel (bool), onModernModelChange (fn), showModernToggle (bool)
 */
export default function RuleSections({
  entries,
  selectedRuleIds,
  conflictSelections,
  onToggle,
  onSelect,
  modernModel,
  onModernModelChange,
  showModernToggle = false,
}) {
  const sections = groupBySubcategory(entries)

  const renderRule = (entry) =>
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
    )

  return (
    <div className="space-y-8">
      {showModernToggle && (
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
            checked={modernModel}
            onChange={(e) => onModernModelChange(e.target.checked)}
          />
          <span className="min-w-0">
            <span className="block font-medium text-slate-900">
              I’m using a recent AI model
            </span>
            <span className="mt-0.5 block text-sm text-slate-500">
              Newer AIs (2025 and later) already do some of this. We’ll tuck away the
              rules they usually handle — here and in the next step — so you see fewer. You
              can still show them anytime.
            </span>
          </span>
        </label>
      )}

      {sections.map(({ subcategory, entries: sectionEntries }) => {
        const meta = SUBCATEGORY_META[subcategory] ?? { title: subcategory, description: '' }

        // In modern mode, hold back expiring patches the user hasn't selected.
        const visible = []
        const tucked = []
        for (const entry of sectionEntries) {
          if (
            modernModel &&
            isExpiringPatch(entry) &&
            !selectedRuleIds.has(entry.id)
          ) {
            tucked.push(entry)
          } else {
            visible.push(entry)
          }
        }

        return (
          <section key={subcategory}>
            <h3 className="text-lg font-semibold text-slate-900">{meta.title}</h3>
            {meta.description && (
              <p className="mb-3 mt-0.5 text-sm text-slate-500">{meta.description}</p>
            )}
            <div className="space-y-3">
              {visible.map(renderRule)}
              {tucked.length > 0 && (
                <details className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-600">
                    {tucked.length} {tucked.length === 1 ? 'rule' : 'rules'} newer AIs
                    usually handle — show anyway
                  </summary>
                  <div className="mt-3 space-y-3">{tucked.map(renderRule)}</div>
                </details>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
