/**
 * A mutually-exclusive choice rendered as a group of radio cards.
 * The initial selection falls back to `group.default_option` until the user picks one.
 *
 * Props: group, selectedOption (number | undefined), onSelect
 */
export default function ConflictGroup({ group, selectedOption, onSelect }) {
  const active = selectedOption !== undefined ? selectedOption : group.default_option

  return (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
      <legend className="px-1 font-medium text-slate-900">{group.label}</legend>
      <p className="mb-3 text-sm text-slate-500">{group.description}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {group.options.map((option, index) => {
          const isActive = active === index
          return (
            <label
              key={option.label}
              className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={group.id}
                  className="h-4 w-4 cursor-pointer accent-indigo-600"
                  checked={isActive}
                  onChange={() => onSelect(group.id, index)}
                />
                <span className="font-medium text-slate-900">{option.label}</span>
              </span>
              <span className="text-sm text-slate-500">{option.description}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
