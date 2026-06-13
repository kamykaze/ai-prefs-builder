/**
 * Explainer of *why* the tool exists (with concrete examples of AI misbehavior) and
 * *how* it works at a high level. Rendered as a collapsed-by-default disclosure on
 * every step, so a newcomer can open it whenever they need orientation without it
 * taking space once they're underway.
 */
export default function Intro() {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white/60 shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between gap-2 px-5 py-4 font-semibold text-slate-900 sm:px-7">
        <h2 className="text-lg font-semibold text-slate-900">What is this?</h2>
        <span
          aria-hidden="true"
          className="text-slate-400 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="space-y-6 px-5 pb-5 sm:px-7 sm:pb-7">
        <div>
          <p className="mt-1 text-slate-600">
            AI chat tools are genuinely useful — but they don’t always behave the way
            you’d expect, and the quirks are easy to miss if you’re new to them. Left to
            their defaults, they often:
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-600 marker:text-slate-400">
            <li>Agree with you even when you’re wrong, just to seem helpful</li>
            <li>Make up facts, names, or sources that sound real but aren’t</li>
            <li>Bury a one-line answer under compliments and filler</li>
            <li>Assume what you meant instead of asking</li>
          </ul>
          <p className="mt-3 text-slate-600">
            This tool is designed to help you fix those issues, by generating instructions you can give
            your AI to make it behave better. It’s like a “starter kit” for getting the most out
            of your AI, without having to learn the ins and outs of prompt engineering.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
          <p className="mt-3 text-slate-600">
            Most AI tools let you tell them how to behave, once — they
            just don’t make it obvious, and it’s hard to know how to word it. This tool
            writes those instructions for you, in plain language. You then copy and paste
            the generated text into your AI tool’s settings.
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-slate-600 marker:font-semibold marker:text-slate-400">
            <li>Answer a few optional questions about how you use AI.</li>
            <li>
              Pick the behaviors you want to fix and the habits you want to encourage.
            </li>
            <li>
              Copy the text we generate and paste it into your AI tool’s settings — or
              the start of a chat. We’ll show you exactly where.
            </li>
          </ol>
          <p className="mt-3 text-sm text-slate-500">
            It takes a couple of minutes, and nothing you enter ever leaves your browser.
          </p>
        </div>
      </div>
    </details>
  )
}
