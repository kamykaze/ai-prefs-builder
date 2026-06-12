import StepIndicator from './ui/StepIndicator'
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
 * Layout wrapper: progress indicator on top, the active step in the middle,
 * and Back / Next / Generate navigation at the bottom. Every step is optional,
 * so "Next" is always enabled.
 *
 * Props: wizard (the useWizardState object)
 */
export default function WizardShell({ wizard }) {
  const { currentStep, setStep } = wizard
  const StepComponent = STEPS[currentStep]

  const isFirst = currentStep === 0
  const isLast = currentStep === TOTAL_STEPS - 1
  const isGenerateStep = currentStep === TOTAL_STEPS - 2 // Step 3 → Generate

  function goNext() {
    setStep(currentStep + 1)
  }

  function goBack() {
    setStep(currentStep - 1)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          AI Preferences Builder
        </h1>
        <p className="mt-2 text-slate-500">
          Build a set of instructions that make AI tools work the way you want — then
          paste it into Claude, ChatGPT, Gemini, or anywhere else.
        </p>
      </header>

      <StepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={setStep}
      />

      <main className="rounded-xl border border-slate-200 bg-white/60 p-5 shadow-sm sm:p-7">
        <StepComponent wizard={wizard} />
      </main>

      <nav className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirst}
          className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-colors ${
            isFirst
              ? 'invisible'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          {isFirst && (
            <button
              type="button"
              onClick={goNext}
              className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
            >
              Skip for now
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

      <footer className="mt-8 text-center text-xs text-slate-400">
        Nothing you enter is saved or sent anywhere. It all stays in your browser.
      </footer>
    </div>
  )
}
