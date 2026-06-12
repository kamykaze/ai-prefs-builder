/**
 * A single on/off rule card.
 * Renders as a clickable label wrapping a real checkbox so it's keyboard-
 * accessible and screen-reader friendly out of the box.
 *
 * Props: rule, isSelected, onToggle
 */
export default function RuleToggle({ rule, isSelected, onToggle }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
        checked={isSelected}
        onChange={() => onToggle(rule.id)}
      />
      <span className="min-w-0">
        <span className="block font-medium text-slate-900">{rule.label}</span>
        <span className="mt-0.5 block text-sm text-slate-500">{rule.description}</span>
      </span>
    </label>
  )
}
