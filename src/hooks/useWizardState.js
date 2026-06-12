import { useCallback, useMemo, useState } from 'react'
import { generateOutput as buildOutput } from '../utils/generateOutput'
import { getDefaultOnRuleIds, TOTAL_STEPS } from '../utils/ruleHelpers'

const initialContext = {
  professions: [],
  hobbies: [],
  useCases: [],
  techLevel: null,
}

/**
 * Central wizard state + actions (spec State Shape).
 * Holds everything locally — nothing is persisted anywhere.
 */
export function useWizardState() {
  const [context, setContextState] = useState(initialContext)
  const [selectedRuleIds, setSelectedRuleIds] = useState(() => getDefaultOnRuleIds())
  const [conflictSelections, setConflictSelections] = useState({})
  const [customRules, setCustomRules] = useState('')
  const [currentStep, setCurrentStep] = useState(0)

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
