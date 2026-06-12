import RuleSections from './RuleSections'
import { getGuardrails } from '../../utils/ruleHelpers'

const GUARDRAILS = getGuardrails()

/**
 * Step 1 — Guardrails. Shown to everyone regardless of Step 0.
 *
 * Props: wizard (the useWizardState object)
 */
export default function Step1Guardrails({ wizard }) {
  const { selectedRuleIds, conflictSelections, toggleRule, setConflictSelection } = wizard

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">
          Pick the AI behaviors you want to fix
        </h2>
        <p className="mt-1 text-slate-500">
          These are common AI annoyances. A few sensible defaults are already turned on —
          adjust anything you like.
        </p>
      </header>

      <RuleSections
        entries={GUARDRAILS}
        selectedRuleIds={selectedRuleIds}
        conflictSelections={conflictSelections}
        onToggle={toggleRule}
        onSelect={setConflictSelection}
      />
    </div>
  )
}
