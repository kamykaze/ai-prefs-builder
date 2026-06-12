import { useMemo } from 'react'
import RuleSections from './RuleSections'
import { getBestPracticesForUser } from '../../utils/ruleHelpers'

/**
 * Step 2 — Best Practices, filtered by the user's Step 0 context.
 * If no context was selected, all best practices are shown.
 *
 * Props: wizard (the useWizardState object)
 */
export default function Step2BestPractices({ wizard }) {
  const {
    context,
    selectedRuleIds,
    conflictSelections,
    toggleRule,
    setConflictSelection,
  } = wizard

  const entries = useMemo(() => getBestPracticesForUser(context), [context])

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">
          Add proactive behaviors that fit how you work
        </h2>
        <p className="mt-1 text-slate-500">
          Optional extras tailored to what you told us. Turn on anything useful — or skip
          ahead.
        </p>
      </header>

      {entries.length > 0 ? (
        <RuleSections
          entries={entries}
          selectedRuleIds={selectedRuleIds}
          conflictSelections={conflictSelections}
          onToggle={toggleRule}
          onSelect={setConflictSelection}
        />
      ) : (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-500">
          No extra suggestions for your selections — feel free to continue.
        </p>
      )}
    </div>
  )
}
