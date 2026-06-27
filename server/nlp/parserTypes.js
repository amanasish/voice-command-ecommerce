import { parseIntent } from "./intentParser.js";
import { parseIntentAI } from "./openaiParser.js";

export async function parse(transcript) {
  try {
    return await parseIntentAI(transcript);
  } catch (error) {
    console.warn(
      `OpenAI parser unavailable (${error.code || error.message}). Falling back to rule-based parser.`
    );

    return parseIntent(transcript);
  }
}