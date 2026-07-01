import dotenv from "dotenv";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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

  return extractJson(text);
}
