// utils/regexParser.js
//
// Rule-based (regex) intent parser — CommonJS port of server/nlp/intentParser.js
// Used as a fallback when the Groq API is unavailable.

const CATEGORIES = ["shirts", "jeans", "kurtas", "phones"];
const COLORS = ["red", "blue", "black"];

const ACTIONS = {
  filter: ["show", "find", "search"],
  addToCart: ["add to cart", "add this to cart"],
  removeFromCart: ["remove last item"],
  checkout: ["checkout", "check out", "place order"],
  viewCart: ["show my cart", "show cart", "open cart", "view cart", "my cart"],
};

const PRICE_MAX_REGEX = /(?:under|below|less than)\s+(\d+)/i;
const PRICE_RANGE_REGEX = /between\s+(\d+)\s+and\s+(\d+)/i;
const QUANTITY_REGEX = /(\d+)\s+(?:items?|pieces?)/i;
const PRODUCT_ID_REGEX = /(?:product|item)\s+(p\d+)|\b(p\d+)\b/i;
const ADD_TO_CART_REGEX = /\badd\b[\s\S]*\bto cart\b/i;
const REMOVE_FROM_CART_REGEX = /\bremove\b[\s\S]*\b(?:from cart|last item)\b/i;
const VIEW_CART_REGEX = /\b(show|view|open)\s+(my\s+)?cart\b/i;
const CHECKOUT_REGEX = /\b(check\s*out|place\s+order)\b/i;

function normalizeTranscript(transcript) {
  return transcript
    .toLowerCase()
    .trim()
    .replace(/[.,!?]+$/, "")
    .replace(/\s+/g, " ");
}

function detectAction(text) {
  if (VIEW_CART_REGEX.test(text)) return "viewCart";
  if (ADD_TO_CART_REGEX.test(text)) return "addToCart";
  if (REMOVE_FROM_CART_REGEX.test(text)) return "removeFromCart";
  if (CHECKOUT_REGEX.test(text)) return "checkout";

  // Priority order: viewCart, addToCart, removeFromCart, checkout, filter
  const priorityOrder = ["viewCart", "addToCart", "removeFromCart", "checkout", "filter"];
  for (const action of priorityOrder) {
    for (const phrase of ACTIONS[action]) {
      if (text.includes(phrase)) return action;
    }
  }

  return null;
}

function parseIntent(transcript) {
  const text = normalizeTranscript(transcript);
  const intent = {};

  intent.action = detectAction(text);

  for (const category of CATEGORIES) {
    if (text.includes(category)) {
      intent.category = category;
      break;
    }
  }

  for (const color of COLORS) {
    if (text.includes(color)) {
      intent.color = color;
      break;
    }
  }

  const price = text.match(PRICE_MAX_REGEX)?.[1];
  if (price) intent.priceMax = Number(price);

  const range = text.match(PRICE_RANGE_REGEX);
  if (range) {
    intent.priceMin = Number(range[1]);
    intent.priceMax = Number(range[2]);
  }

  const quantity = text.match(QUANTITY_REGEX)?.[1];
  if (quantity) intent.quantity = Number(quantity);

  const productIdMatch = text.match(PRODUCT_ID_REGEX);
  const productId = productIdMatch?.[1] || productIdMatch?.[2];
  if (productId) intent.productId = productId;

  // Infer action from context if still null
  if (!intent.action) {
    if (intent.productId && /\badd\b/.test(text) && /\bto cart\b/.test(text)) {
      intent.action = "addToCart";
    } else if (intent.category || intent.color || intent.priceMax != null) {
      intent.action = "filter";
    }
  }

  return intent;
}

module.exports = { parseIntent };
