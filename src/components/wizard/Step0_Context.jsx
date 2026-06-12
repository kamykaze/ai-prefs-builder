import Chip from '../ui/Chip'
import {
  PROFESSIONS,
  HOBBIES,
  USE_CASES,
  TECH_LEVELS,
} from '../../data/contextOptions'

/**
 * Step 0 — Personal Context. All fields optional; selections only filter which
 * best practices appear in Step 2. Generates no rules itself.
 *
 * Props: wizard (the useWizardState object)
 */
export default function Step0Context({ wizard }) {
  const { context, setContext } = wizard

  // Multi-select: toggle a slug in/out of the given context field array.
  function toggleMulti(field, slug) {
    const current = context[field]
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]
    setContext(field, next)
  }

  // Single-select: pick a value, or clear it by re-clicking the active one.
  function selectSingle(field, slug) {
    setContext(field, context[field] === slug ? null : slug)
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">
          Tell us a little about how you use AI
        </h2>
        <p className="mt-1 text-slate-500">
          This just helps us suggest relevant tips later. Everything here is optional —
          you can skip it.
        </p>
      </header>

      <ChipField
        label="What do you do?"
        hint="Pick any that apply."
        options={PROFESSIONS}
        selected={context.professions}
        onToggle={(slug) => toggleMulti('professions', slug)}
      />

      <ChipField
        label="Hobbies & interests"
        hint="Pick any that apply."
        options={HOBBIES}
        selected={context.hobbies}
        onToggle={(slug) => toggleMulti('hobbies', slug)}
      />

      <ChipField
        label="What do you mainly use AI for?"
        hint="Pick any that apply."
        options={USE_CASES}
        selected={context.useCases}
        onToggle={(slug) => toggleMulti('useCases', slug)}
      />

      <fieldset>
        <legend className="font-medium text-slate-900">How technical are you?</legend>
        <p className="mb-3 text-sm text-slate-500">Pick one.</p>
        <div className="flex flex-wrap gap-2">
          {TECH_LEVELS.map((option) => (
            <Chip
              key={option.slug}
              label={option.label}
              isSelected={context.techLevel === option.slug}
              onClick={() => selectSingle('techLevel', option.slug)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}

function ChipField({ label, hint, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="font-medium text-slate-900">{label}</legend>
      {hint && <p className="mb-3 text-sm text-slate-500">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option.slug}
            label={option.label}
            isSelected={selected.includes(option.slug)}
            onClick={() => onToggle(option.slug)}
          />
        ))}
      </div>
    </fieldset>
  )
}
