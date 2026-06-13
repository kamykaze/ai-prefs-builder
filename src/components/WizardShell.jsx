import StepIndicator from './ui/StepIndicator'
import PreviewPanel from './ui/PreviewPanel'
import Intro from './wizard/Intro'
import Step0Context from './wizard/Step0_Context'
import Step1Guardrails from './wizard/Step1_Guardrails'
import Step2BestPractices from './wizard/Step2_BestPractices'
import Step3Custom from './wizard/Step3_Custom'
import Step4Output from './wizard/Step4_Output'
import { TOTAL_STEPS } from '../utils/ruleHelpers'

const STEPS = [
  Step0Context,
  Step1Guardrails,
  Step2BestPractices,
  Step3Custom,
  Step4Output,
]

/**
 * Layout wrapper. The left column holds the vertical step sidebar with the live
 * preview stacked beneath it; the right column is the active step's form plus
 * Back / Next / Generate navigation. Keeping the preview on the left leaves the form
 * at a constant, comfortable width across every step.
 *
 * On narrow screens the sidebar collapses to a compact progress bar and the preview
 * becomes a collapsible panel above the form. Every step is optional, so "Next" is
 * always enabled.
 *
 * Props: wizard (the useWizardState object)
 */
export default function WizardShell({ wizard }) {
  const { currentStep, setStep, reset } = wizard
  const StepComponent = STEPS[currentStep]

  const isFirst = currentStep === 0
  const isLast = currentStep === TOTAL_STEPS - 1
  const isGenerateStep = currentStep === TOTAL_STEPS - 2 // Step 3 → Generate
  const showPreview = currentStep >= 1 && currentStep <= 3

  function goNext() {
    setStep(currentStep + 1)
  }

  function goBack() {
    setStep(currentStep - 1)
  }

  function handleReset() {
    if (
      window.confirm('Start over and clear all your selections? This can’t be undone.')
    ) {
      reset()
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          AI Preferences Builder
        </h1>
        <p className="mt-2 text-slate-500">
          Build a set of instructions that make AI tools work the way you want — then
          paste it into Claude, ChatGPT, Gemini, or anywhere else.
        </p>
      </header>

      {/* Collapsed-by-default explainer, available on every step. */}
      <div className="mb-6">
        <Intro />
      </div>

      {/* Narrow screens: compact progress bar instead of the tall sidebar. */}
      <StepIndicator
        variant="compact"
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={setStep}
        className="mb-6 lg:hidden"
      />

      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8">
        {/* Left column: steps, then live preview beneath. */}
        <aside className="hidden space-y-6 lg:sticky lg:top-6 lg:block">
          <StepIndicator
            variant="vertical"
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onStepClick={setStep}
          />
          {showPreview && <PreviewPanel wizard={wizard} />}
        </aside>

        <div>
          {/* Collapsible preview for narrow screens, above the form. */}
          {showPreview && (
            <div className="mb-4 lg:hidden">
              <PreviewPanel wizard={wizard} collapsible />
            </div>
          )}

          <main className="rounded-xl border border-slate-200 bg-white/60 p-5 shadow-sm sm:p-7">
            <StepComponent wizard={wizard} />
          </main>

          <nav className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Start over
            </button>

            <div className="ml-auto flex items-center gap-3">
              {isFirst && (
                <button
                  type="button"
                  onClick={goNext}
                  className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                >
                  Skip for now
                </button>
              )}
              {!isFirst && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Back
                </button>
              )}
              {!isLast && (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {isGenerateStep ? 'Generate' : 'Next'}
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400">
        Your selections are saved in this browser only — never uploaded anywhere.
      </footer>
    </div>
  )
}
