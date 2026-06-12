import { useMemo } from 'react'
import CopyButton from './CopyButton'
import { classifyLength } from '../../utils/outputLength'

/**
 * Live preview of the generated preferences blob. Updates in real time as the user
 * toggles rules, so they can see exactly what's being added instead of waiting until
 * the end. Reused in two wrappers (sticky desktop column + collapsible mobile panel).
 *
 * Props: wizard, collapsible (render inside a <details> for small screens)
 */
export default function PreviewPanel({ wizard, collapsible = false }) {
  const output = useMemo(() => wizard.generateOutput(), [wizard.generateOutput])
  const count = output ? output.split('\n').length : 0
  const { count: charCount, tone } = classifyLength(output)

  const body = (
    <>
      {output ? (
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-800">
          {output}
        </pre>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-400">
          Nothing selected yet. Turn on a rule and it’ll appear here.
        </p>
      )}
      {output && (
        <div className="mt-3">
          <CopyButton text={output} />
        </div>
      )}
    </>
  )

  if (collapsible) {
    return (
      <details className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold text-slate-900">
          Live preview{' '}
          <span className="font-normal text-slate-400">
            ({count} {count === 1 ? 'preference' : 'preferences'} ·{' '}
            <span className={tone === 'over' ? 'text-amber-700' : undefined}>
              {charCount.toLocaleString()} chars
            </span>
            )
          </span>
        </summary>
        <div className="mt-3">{body}</div>
      </details>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-semibold text-slate-900">Live preview</h2>
        <span className="text-sm text-slate-400">
          {count} {count === 1 ? 'preference' : 'preferences'} ·{' '}
          <span className={tone === 'over' ? 'text-amber-700' : undefined}>
            {charCount.toLocaleString()} chars
          </span>
        </span>
      </div>
      {body}
    </div>
  )
}
