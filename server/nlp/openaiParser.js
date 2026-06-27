import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseIntentAI(transcript) {
  const prompt = `
Convert the shopping command into JSON.

Return only valid JSON.

Schema:
{
  "action": "filter | addToCart | removeFromCart | checkout",
  "category": "string | null",
  "color": "string | null",
  "priceMax": "number | null"
}

Command: "${transcript}"
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return JSON.parse(response.output_text);
}