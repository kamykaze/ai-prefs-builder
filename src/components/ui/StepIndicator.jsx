// Step metadata — title plus a short "what's in here" descriptor so the wizard's
// length and shape are clear up front instead of being five anonymous circles.
export const STEPS_META = [
  { title: 'Context', description: 'About how you use AI' },
  { title: 'Guardrails', description: 'Fix common AI behaviors' },
  { title: 'Best Practices', description: 'Proactive extras for you' },
  { title: 'Custom Rules', description: 'Add your own' },
  { title: 'Output', description: 'Copy your preferences' },
]

/**
 * Wizard progress.
 *  - variant="vertical": a left-sidebar stepper (number + title + descriptor), with
 *    completed steps clickable to navigate back.
 *  - variant="compact": a slim "Step X of N · Title" header with a progress bar, for
 *    narrow screens where a full vertical list would be too tall.
 *
 * Props: currentStep, totalSteps, onStepClick, variant, className
 */
export default function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  variant = 'vertical',
  className = '',
}) {
  if (variant === 'compact') {
    const meta = STEPS_META[currentStep] ?? { title: '' }
    const pct = ((currentStep + 1) / totalSteps) * 100
    return (
      <div className={className} aria-label="Progress">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-900">{meta.title}</span>
          <span className="text-xs text-slate-400">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <nav aria-label="Progress" className={className}>
      <ol>
        {STEPS_META.slice(0, totalSteps).map((meta, index) => {
          const isCurrent = index === currentStep
          const isCompleted = index < currentStep
          const isLast = index === totalSteps - 1

          const circleClasses = isCurrent
            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
            : isCompleted
              ? 'bg-indigo-600 text-white'
              : 'border-2 border-slate-300 bg-white text-slate-400'

          const content = (
            <>
              {/* Connector line down to the next step. */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                    isCompleted ? 'bg-indigo-300' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${circleClasses}`}
              >
                {isCompleted ? '✓' : index + 1}
              </span>
              <span className="flex flex-col pt-0.5">
                <span
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? 'text-indigo-700'
                      : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                  }`}
                >
                  {meta.title}
                </span>
                <span
                  className={`text-xs ${isUpcoming(index, currentStep) ? 'text-slate-300' : 'text-slate-500'}`}
                >
                  {meta.description}
                </span>
              </span>
            </>
          )

          return (
            <li key={meta.title} className={`relative flex gap-3 ${isLast ? '' : 'pb-7'}`}>
              {isCompleted ? (
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  aria-label={`Go to step ${index + 1}: ${meta.title}`}
                  className="flex flex-1 cursor-pointer gap-3 rounded-md text-left transition-opacity hover:opacity-80"
                >
                  {content}
                </button>
              ) : (
                <div
                  className="flex flex-1 gap-3"
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {content}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function isUpcoming(index, currentStep) {
  return index > currentStep
}
