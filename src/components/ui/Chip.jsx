/**
 * A pill-style toggle button used for the multi-select / single-select fields
 * in Step 0. Uses aria-pressed so its state is announced to screen readers.
 *
 * Props: label, isSelected, onClick
 */
export default function Chip({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isSelected
          ? 'border-indigo-500 bg-indigo-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {label}
    </button>
  )
}
