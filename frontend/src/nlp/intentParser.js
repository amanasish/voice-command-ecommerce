import { ACTIONS, CATEGORIES, COLORS } from "./constants.js";
import {
  PRICE_MAX_REGEX,
  PRICE_RANGE_REGEX,
  QUANTITY_REGEX,
  PRODUCT_ID_REGEX,
  ADD_TO_CART_REGEX,
  REMOVE_FROM_CART_REGEX,
  VIEW_CART_REGEX,
  CHECKOUT_REGEX,
} from "./patterns.js";

// Specific actions first — filter's "show" must not beat "show my cart"
const ACTION_PRIORITY = [
  "viewCart",
  "addToCart",
  "removeFromCart",
  "checkout",
  "filter",
];

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

  for (const action of ACTION_PRIORITY) {
    for (const phrase of ACTIONS[action]) {
      if (text.includes(phrase)) {
        return action;
      }
    }
  }

  return null;
}

export function parseIntent(transcript) {
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

  if (!intent.action) {
    if (intent.productId && /\badd\b/.test(text) && /\bto cart\b/.test(text)) {
      intent.action = "addToCart";
    } else if (
      intent.category ||
      intent.color ||
      intent.priceMax != null
    ) {
      intent.action = "filter";
    }
  }

  return intent;
}
