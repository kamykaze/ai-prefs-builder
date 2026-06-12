/**
 * Step 3 — Custom Rules. Free-text instructions appended verbatim to the output.
 * No validation; the character count is guidance only (limits vary by AI tool).
 *
 * Props: wizard (the useWizardState object)
 */
export default function Step3Custom({ wizard }) {
  const { customRules, setCustomRules } = wizard

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Anything else?</h2>
        <p className="mt-1 text-slate-500">
          Add your own rules — or a few facts about yourself that help AI respond the
          way you want. We’ll include them as-is.
        </p>
      </header>

      <div>
        <textarea
          value={customRules}
          onChange={(e) => setCustomRules(e.target.value)}
          rows={8}
          placeholder={
            "e.g. I'm a non-native English speaker, so keep wording simple.\nAlways respond in metric units.\nI use TickTick for my to-do lists."
          }
          className="w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <p className="mt-1.5 text-right text-sm text-slate-400">
          {customRules.length} characters
        </p>
      </div>
    </div>
  )
}
