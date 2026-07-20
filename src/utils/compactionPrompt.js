// A generated preferences blob is a flat numbered list — every line is read on
// every turn. Past ~15 lines, related rules start to compete for attention and
// merging them pays off. Threshold comes from the rules-audit finding that a
// 36-line list compressed to 10 with no intent lost.
export const COMPACTION_LINE_THRESHOLD = 15

// Fixed instructions prepended to the user's generated rules. Deliberately plain
// and tool-agnostic so it works in Claude, ChatGPT, Gemini, or any other tool.
// The "keep exactly that choice" line protects conflict-group picks (e.g.
// "Concise" vs "Thorough") from being re-expanded into all their alternatives.
const PROMPT_PREAMBLE = `Below is a list of preference instructions I use to control how you respond. There's a lot of overlap and too many separate lines, which makes them compete for attention. Please rewrite them into a shorter, cleaner set.

- Merge instructions that cover the same idea into one clear line.
- Keep every distinct intent — don't drop any behavior I asked for.
- Where I've chosen between options (like how detailed answers should be, or how feedback is delivered), keep exactly that choice — don't reintroduce the alternatives.
- Some lines are free-form personal notes rather than rules — these are my own words and matter most, so preserve them fully. Never drop or water them down, even while merging everything else, and list them first so they're safe if the text ever gets cut short.
- Aim for 15 lines or fewer.
- Return only the final result as a plain numbered list inside a code block, so I can copy it cleanly with the numbers and line breaks intact. No explanation or commentary.

Here are my current preferences:`

/**
 * Builds the copy-pasteable "compact with AI" meta-prompt: fixed instructions
 * followed by the user's generated preferences blob. Returns '' for empty input.
 */
export function buildCompactionPrompt(output) {
  if (!output) return ''
  return `${PROMPT_PREAMBLE}\n\n${output}`
}

/** Number of numbered rule lines in a generated blob (0 when empty). */
export function countRuleLines(output) {
  if (!output) return 0
  return output.split('\n').length
}
