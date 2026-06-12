const STEP_LABELS = ['Context', 'Guardrails', 'Best Practices', 'Custom', 'Output']

/**
 * Progress dots across the top of the wizard.
 * Completed steps are clickable to navigate back; upcoming steps are disabled.
 *
 * Props: currentStep, totalSteps, onStepClick
 */
export default function StepIndicator({ currentStep, totalSteps, onStepClick }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCurrent = index === currentStep
          const isCompleted = index < currentStep
          const canNavigate = isCompleted

          return (
            <li key={index} className="flex items-center">
              <button
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && onStepClick(index)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : isCompleted
                      ? 'cursor-pointer bg-indigo-200 text-indigo-800 hover:bg-indigo-300'
                      : 'bg-slate-200 text-slate-400'
                }`}
                title={STEP_LABELS[index]}
              >
                {index + 1}
              </button>
              {index < totalSteps - 1 && (
                <span
                  className={`mx-1 h-0.5 w-4 sm:w-8 ${
                    isCompleted ? 'bg-indigo-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
