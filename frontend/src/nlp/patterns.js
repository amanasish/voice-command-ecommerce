export const PRICE_MAX_REGEX = /(?:under|below|less than)\s+(\d+)/i;

export const PRICE_RANGE_REGEX = /between\s+(\d+)\s+and\s+(\d+)/i;

export const QUANTITY_REGEX = /(\d+)\s+(?:items?|pieces?)/i;

export const PRODUCT_ID_REGEX = /(?:product|item)\s+(p\d+)|\b(p\d+)\b/i;

export const ADD_TO_CART_REGEX = /\badd\b[\s\S]*\bto cart\b/i;

export const REMOVE_FROM_CART_REGEX = /\bremove\b[\s\S]*\b(?:from cart|last item)\b/i;

export const VIEW_CART_REGEX = /\b(show|view|open)\s+(my\s+)?cart\b/i;

export const CHECKOUT_REGEX = /\b(check\s*out|place\s+order)\b/i;
