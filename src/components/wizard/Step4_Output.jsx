import { useMemo } from 'react'
import CopyButton from '../ui/CopyButton'
import { CHATGPT_LIMIT, classifyLength } from '../../utils/outputLength'

const PASTE_INSTRUCTIONS = [
  {
    tool: 'Claude',
    path: 'Settings → Profile → “What personal preferences should Claude consider in responses?”',
  },
  {
    tool: 'ChatGPT',
    path: 'Click your profile → Customize ChatGPT → “How would you like ChatGPT to respond?”',
  },
  {
    tool: 'Gemini',
    path: 'Settings → Saved info → “Your instructions for Gemini”',
  },
  {
    tool: 'Grok',
    path: 'Settings → Customize → “Custom instructions” (in the Grok app or on X)',
  },
  {
    tool: 'Perplexity',
    path: 'Settings → Personalize → “Introduce yourself”',
  },
]

/**
 * Step 4 — Output. Shows the generated preferences blob with copy + start-over.
 *
 * Props: wizard (the useWizardState object)
 */
export default function Step4Output({ wizard }) {
  const { generateOutput, reset } = wizard
  const output = useMemo(() => generateOutput(), [generateOutput])
  const { count, tone } = classifyLength(output)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Your preferences are ready</h2>
        <p className="mt-1 text-slate-500">
          Copy and paste this into your AI tool’s settings. Works with Claude, ChatGPT,
          Gemini, and most others.
        </p>
      </header>

      {output ? (
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800">
          {output}
        </pre>
      ) : (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-500">
          You haven’t selected any rules yet. Go back and pick a few, or add your own in
          the previous step.
        </p>
      )}

      {output && (
        <div>
          <p
            className={`text-right text-sm ${
              tone === 'over' ? 'font-medium text-amber-700' : 'text-slate-400'
            }`}
          >
            {count.toLocaleString()} characters
          </p>
          {tone === 'over' && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              This is over ChatGPT’s ~{CHATGPT_LIMIT.toLocaleString()}-character
              custom-instructions limit. It still fits Claude, Gemini, Grok, and most
              others — for ChatGPT, deselect a few rules or trim your custom text, or
              paste it at the start of a chat instead.
            </p>
          )}
          {tone === 'near' && (
            <p className="mt-1 text-right text-sm text-slate-400">
              Getting close to ChatGPT’s ~{CHATGPT_LIMIT.toLocaleString()}-character limit.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={output} />
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Start over
        </button>
      </div>

      <details className="rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-medium text-slate-900">
          Where do I paste this?
        </summary>
        <ul className="mt-3 space-y-2">
          {PASTE_INSTRUCTIONS.map((item) => (
            <li key={item.tool} className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{item.tool}:</span>{' '}
              {item.path}
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
          Using a tool without a settings field (or one not listed here)? Paste this at
          the start of a new chat — it works the same way.
        </p>
      </details>
    </div>
  )
}
