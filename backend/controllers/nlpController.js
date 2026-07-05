// controllers/nlpController.js
//
// NLP Controller — Groq AI parser with regex fallback
// POST /nlp/parse
//
// Response shape:
//   { success: true, intent: { action, category, color, ... } }
//   { success: true, intent: { ... }, fallback: true }   <- when Groq failed
//   { success: false, error: "..." }                     <- hard failure

const { parseIntent } = require("../utils/regexParser");

const ALLOWED_CATEGORIES = new Set(["shirts", "jeans", "kurtas", "phones"]);

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ============================================================
// Helper: extract JSON from Groq response text
// (Groq sometimes wraps in markdown fences even with json_object mode)
// ============================================================
function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Groq response did not contain valid JSON.");
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

function finaliseAction(intent, transcript) {
  if (!intent || typeof intent !== "object") {
    return intent;
  }

  const text = String(transcript || "").toLowerCase();

  if (intent.action === "viewCart" && !/\bcart\b/.test(text)) {
    if (intent.category || intent.occasion || intent.color || intent.priceMin != null || intent.priceMax != null) {
      intent.action = "filter";
    } else {
      intent.action = null;
    }
  }

  if (!intent.action) {
    if (intent.category || intent.occasion || intent.color || intent.priceMin != null || intent.priceMax != null) {
      intent.action = "filter";
    }
  }

  return intent;
}

// ============================================================
// Helper: call Groq API and return parsed intent object
// ============================================================
async function callGroq(transcript) {
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

  const response = await fetch(GROQ_URL, {
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
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${message}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) throw new Error("Groq returned an empty response.");

  return extractJson(text);
}

// ============================================================
// Controller: POST /nlp/parse
// ============================================================
const parseTranscript = async (req, res) => {
  const { transcript } = req.body || {};

  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    return res.status(400).json({
      success: false,
      error: "transcript is required and must be a non-empty string",
    });
  }

  // --- Try Groq first ---
  if (GROQ_API_KEY) {
    try {
      const intent = finaliseAction(
        normalizeIntent(await callGroq(transcript.trim())),
        transcript.trim()
      );
      return res.json({ success: true, intent });
    } catch (err) {
      console.warn(`[nlp] Groq failed: ${err.message}. Falling back to regex parser.`);
      // Fall through to regex fallback below
    }
  } else {
    console.warn("[nlp] GROQ_API_KEY not set. Using regex parser.");
  }

  // --- Regex fallback ---
  try {
    const intent = finaliseAction(
      normalizeIntent(parseIntent(transcript.trim())),
      transcript.trim()
    );
    return res.json({ success: true, intent, fallback: true });
  } catch (err) {
    console.error("[nlp] Regex parser also failed:", err.message);
    return res.status(500).json({ success: false, error: "Failed to parse transcript" });
  }
};

module.exports = { parseTranscript };
