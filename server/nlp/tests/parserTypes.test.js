import { parse } from "../parserTypes.js";

const intent = await parse("show me diwali outfits");

if (!intent || intent.action !== "filter") {
  throw new Error(`Expected filter intent, got ${JSON.stringify(intent)}`);
}

console.log(intent);
