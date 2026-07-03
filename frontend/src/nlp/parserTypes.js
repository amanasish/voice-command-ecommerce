import { parseIntent } from "./intentParser.js";

export async function parse(transcript) {
  return parseIntent(transcript);
}
