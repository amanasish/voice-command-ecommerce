import dotenv from "dotenv";
import { CATEGORIES } from "./constants.js";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const ALLOWED_CATEGORIES = new Set(CATEGORIES);

function extractJson(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Groq response did not contain valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function normalizeIntent(intent) {
  if (!intent || typeof intent !== "object") {
    return intent;
  }

  const normalized = { ...intent };

  if (
    normalized.category &&
    !ALLOWED_CATEGORIES.has(String(normalized.category).toLowerCase())
  ) {
    normalized.category = null;
  }

  if (normalized.category) {
    normalized.category = String(normalized.category).toLowerCase();
  }

  if (normalized.occasion) {
    normalized.occasion = String(normalized.occasion).toLowerCase();
  }

  if (normalized.color) {
    normalized.color = String(normalized.color).toLowerCase();
  }

  return normalized;
}

export async function parseIntentAI(transcript) {
  if (!GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY.");
  }

  const prompt = `
Convert the shopping command into JSON.

Return only valid JSON with these keys:
{
  "action": "filter | addToCart | removeFromCart | checkout | viewCart",
  "category": "string | null",
  "occasion": "string | null",
  "color": "string | null",
  "priceMin": "number | null",
  "priceMax": "number | null",
  "quantity": "number | null",
  "productId": "string | null"
}

Rules:
- Use null for fields that are not present.
- Use lowercase for category, occasion, and color.
- Only use category for real product categories like shirts, jeans, kurtas, or phones.
- If the user says generic words like outfit or outfits, do not put them in category.
- If the user mentions a festival or event like diwali, party, wedding, office, casual, festive, eid, or christmas, put that in occasion.
- Return valid JSON only.
- Do not include markdown, backticks, or commentary.

Command: "${transcript}"
`.trim();

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0,
        top_p: 1,
        messages: [
          {
            role: "system",
            content: [
              "You are a JSON-only parser for e-commerce voice commands.",
              "Extract occasion when the command mentions events or situations like party, wedding, office, casual, festive, diwali, eid, christmas, or similar.",
              "If occasion is not mentioned, return null for occasion.",
            ].join(" "),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: {
          type: "json_object",
        },
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${message}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned an empty response.");
  }

  return normalizeIntent(extractJson(text));
}
