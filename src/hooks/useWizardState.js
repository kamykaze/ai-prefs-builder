import { useCallback, useEffect, useMemo, useState } from 'react'
import { generateOutput as buildOutput } from '../utils/generateOutput'
import { getDefaultOnRuleIds, TOTAL_STEPS } from '../utils/ruleHelpers'
import { clearState, loadState, saveState } from '../utils/persistence'

const initialContext = {
  professions: [],
  hobbies: [],
  useCases: [],
  techLevel: null,
}

/**
 * Central wizard state + actions (spec State Shape).
 * Selections are persisted to localStorage so a returning user resumes their work;
 * `reset()` clears them back to defaults. Nothing leaves the browser.
 */
export function useWizardState() {
  // Read any saved state once, lazily, before seeding the individual slices.
  const [persisted] = useState(loadState)

  const [context, setContextState] = useState(
    () => persisted?.context ?? initialContext,
  )
  const [selectedRuleIds, setSelectedRuleIds] = useState(() =>
    persisted?.selectedRuleIds
      ? new Set(persisted.selectedRuleIds)
      : getDefaultOnRuleIds(),
  )
  const [conflictSelections, setConflictSelections] = useState(
    () => persisted?.conflictSelections ?? {},
  )
  const [customRules, setCustomRules] = useState(() => persisted?.customRules ?? '')
  const [currentStep, setCurrentStep] = useState(() => persisted?.currentStep ?? 0)

  // Persist on every change. The Set is serialized as an array.
  useEffect(() => {
    saveState({
      context,
      selectedRuleIds: [...selectedRuleIds],
      conflictSelections,
      customRules,
      currentStep,
    })
  }, [context, selectedRuleIds, conflictSelections, customRules, currentStep])

  // Step 0 updates one context field at a time (e.g. setContext('professions', [...])).
  const setContext = useCallback((field, value) => {
    setContextState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleRule = useCallback((ruleId) => {
    setSelectedRuleIds((prev) => {
      const next = new Set(prev)
      if (next.has(ruleId)) {
        next.delete(ruleId)
      } else {
        next.add(ruleId)
      }
      return next
    })
  }, [])

  const setConflictSelection = useCallback((groupId, optionIndex) => {
    setConflictSelections((prev) => ({ ...prev, [groupId]: optionIndex }))
  }, [])

  const setStep = useCallback((step) => {
    setCurrentStep(Math.max(0, Math.min(TOTAL_STEPS - 1, step)))
  }, [])

  const reset = useCallback(() => {
    clearState()
    setContextState(initialContext)
    setSelectedRuleIds(getDefaultOnRuleIds())
    setConflictSelections({})
    setCustomRules('')
    setCurrentStep(0)
  }, [])

  const generateOutput = useCallback(
    () => buildOutput({ selectedRuleIds, conflictSelections, customRules }),
    [selectedRuleIds, conflictSelections, customRules],
  )

  return useMemo(
    () => ({
      // state
      context,
      selectedRuleIds,
      conflictSelections,
      customRules,
      currentStep,
      // actions
      setContext,
      toggleRule,
      setConflictSelection,
      setCustomRules,
      setStep,
      reset,
      generateOutput,
    }),
    [
      context,
      selectedRuleIds,
      conflictSelections,
      customRules,
      currentStep,
      setContext,
      toggleRule,
      setConflictSelection,
      setStep,
      reset,
      generateOutput,
    ],
  )
}
