/**
 * "Start over" action with explanatory help text, shown as its own section just above
 * the live preview. The confirm step lives in the parent (WizardShell) so this stays
 * a dumb presentational button.
 *
 * Props: onReset, className
 */
export default function StartOver({ onReset, className = '' }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm ${className}`}>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        Start over
      </button>
      <p className="mt-2 text-xs text-slate-500">
        Clears every selection and your custom text and returns to the first step. This
        can’t be undone.
      </p>
    </section>
  )
}
