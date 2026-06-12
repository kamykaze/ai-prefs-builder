// ChatGPT's custom-instructions box has historically capped around 1,500 characters —
// the tightest limit among the major tools, so we measure against it. Claude, Gemini,
// and Grok allow more, and pasting at the start of a chat has no hard cap.
export const CHATGPT_LIMIT = 1500
const NEAR_THRESHOLD = 1200

/**
 * Classifies an output blob's length for UI feedback.
 * @returns {{ count: number, tone: 'ok' | 'near' | 'over' }}
 */
export function classifyLength(text) {
  const count = text ? text.length : 0
  if (count > CHATGPT_LIMIT) return { count, tone: 'over' }
  if (count >= NEAR_THRESHOLD) return { count, tone: 'near' }
  return { count, tone: 'ok' }
}
