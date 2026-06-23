import { ACTIONS, CATEGORIES, COLORS } from "./constants.js";
import {
  PRICE_MAX_REGEX,
  PRICE_RANGE_REGEX,
  QUANTITY_REGEX,
  PRODUCT_ID_REGEX,
} from "./patterns.js";

export function parseIntent(transcript) {
  const text = transcript.toLowerCase();
  const intent = {};

  for (const action in ACTIONS) {
    for (const phrase of ACTIONS[action]) {
      if (text.includes(phrase)) {
        intent.action = action;
        break;
      }
    }
    if (intent.action) break;
  }

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

  const productId = text.match(PRODUCT_ID_REGEX)?.[1];
  if (productId) intent.productId = productId;

  return intent;
}
