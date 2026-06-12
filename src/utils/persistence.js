// Local persistence for wizard selections so a returning user resumes their work.
// Everything stays in the browser — nothing is ever sent anywhere.
//
// The Set of selected rule ids is serialized as a plain array; everything else is
// stored as-is. Reads are defensive: any malformed/old payload falls back to defaults
// rather than throwing, so a schema change can never trap a user with a broken state.

const STORAGE_KEY = 'ai-prefs-builder:state:v1'

export function loadState() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    return {
      context:
        parsed.context && typeof parsed.context === 'object' ? parsed.context : undefined,
      selectedRuleIds: Array.isArray(parsed.selectedRuleIds)
        ? parsed.selectedRuleIds
        : undefined,
      conflictSelections:
        parsed.conflictSelections && typeof parsed.conflictSelections === 'object'
          ? parsed.conflictSelections
          : undefined,
      customRules:
        typeof parsed.customRules === 'string' ? parsed.customRules : undefined,
      currentStep:
        typeof parsed.currentStep === 'number' ? parsed.currentStep : undefined,
    }
  } catch {
    return null
  }
}

export function saveState(state) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable (e.g. private mode) — persistence is best-effort.
  }
}

export function clearState() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
