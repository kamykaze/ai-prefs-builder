import { AGING_LEGEND, agingPillClasses } from '../../utils/ruleHelpers'

/**
 * One-time key to the aging pills shown on each rule card. Its own collapsible
 * section (open by default) that sits above the live preview on the rule-picking
 * steps, so the user reads it once instead of a sentence on every card.
 */
export default function AgingLegend() {
  return (
    <details
      open
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <summary className="cursor-pointer font-semibold text-slate-900">
        What the tags mean
      </summary>
      <ul className="mt-3 space-y-1.5">
        {AGING_LEGEND.map((item) => (
          <li key={item.tone} className="flex items-start gap-2">
            <span
              className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${agingPillClasses(
                item.tone,
              )}`}
            >
              {item.label}
            </span>
            <span className="text-xs text-slate-500">{item.description}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}
