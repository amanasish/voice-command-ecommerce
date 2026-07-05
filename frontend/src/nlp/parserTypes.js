import { parseTranscript } from "../api/apiClient.js";
import { parseIntent } from "./intentParser.js";

/**
 * parse(transcript) — the single entry point used by VoiceContext.
 *
 * Strategy:
 *   1. Call backend POST /nlp/parse (which uses Groq internally)
 *   2. If the backend itself is unreachable → fall back to local regex parser
 *      and mark the result with { _fallback: "offline" }
 *
 * The `_fallback` flag is read by VoiceControl to show the warning banner.
 */
export async function parse(transcript) {
  try {
    const { intent, fallback } = await parseTranscript(transcript);
    // If backend used its own regex fallback (Groq was down on the server)
    if (fallback) {
      return { ...intent, _fallback: "groq" };
    }
    return intent;
  } catch {
    // Backend is completely unreachable — use the local regex parser
    console.warn("[parserTypes] Backend unreachable. Using local regex parser.");
    const intent = parseIntent(transcript);
    return { ...intent, _fallback: "offline" };
  }
}
