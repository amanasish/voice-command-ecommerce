import * as mockApi from "./mockApi.js";
import { getAuthToken } from "./authApi.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_URL = import.meta.env.VITE_API_URL || "https://voice-command-ecommerce-backend.onrender.com";

if (import.meta.env.DEV) {
  console.log(`[apiClient] mode: ${USE_MOCK ? "mock" : `backend (${API_URL})`}`);
}

let lastOrder = null;

function normalizeImageUrl(imageUrl) {
  if (!imageUrl || USE_MOCK) return imageUrl;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${API_URL}${imageUrl}`;
  return imageUrl;
}

function normalizeProduct(product) {
  return {
    ...product,
    imageUrl: normalizeImageUrl(product.imageUrl),
  };
}

function normalizeCart(cart = []) {
  return cart.map((item) => ({
    ...item,
    imageUrl: normalizeImageUrl(item.imageUrl),
  }));
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeader,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: "Invalid JSON response from server",
  }));

  if (!response.ok && data.success !== false) {
    return { success: false, error: data.error || `Request failed (${response.status})` };
  }

  return data;
}

export async function filterProducts(intent) {
  if (USE_MOCK) return mockApi.filterProducts(intent);

  const result = await request("/products/filter", {
    method: "POST",
    body: JSON.stringify({
      action: "filter",
      category: intent.category,
      occasion: intent.occasion,
      color: intent.color,
      priceMin: intent.priceMin,
      priceMax: intent.priceMax,
    }),
  });

  if (result.success && Array.isArray(result.products)) {
    result.products = result.products.map(normalizeProduct);
  }

  return result;
}

export async function addToCart({ productId, quantity = 1 }) {
  if (USE_MOCK) return mockApi.addToCart({ productId, quantity });

  const result = await request("/cart/add", {
    method: "POST",
    body: JSON.stringify({
      action: "addToCart",
      productId,
      quantity,
    }),
  });

  if (result.success && Array.isArray(result.cart)) {
    result.cart = normalizeCart(result.cart);
  }

  return result;
}

export async function removeFromCart({ productId }) {
  if (USE_MOCK) return mockApi.removeFromCart({ productId });

  const result = await request("/cart/remove", {
    method: "POST",
    body: JSON.stringify({
      action: "removeFromCart",
      productId,
    }),
  });

  if (result.success && Array.isArray(result.cart)) {
    result.cart = normalizeCart(result.cart);
  }

  return result;
}

export async function getCart() {
  if (USE_MOCK) return mockApi.getCart();

  const result = await request("/cart", { method: "GET" });

  if (result.success && Array.isArray(result.cart)) {
    result.cart = normalizeCart(result.cart);
  }

  return result;
}

export async function checkout() {
  if (USE_MOCK) {
    const result = mockApi.checkout();
    lastOrder = mockApi.getLastOrder();
    return result;
  }

  const result = await request("/checkout", {
    method: "POST",
    body: JSON.stringify({ action: "checkout" }),
  });

  if (result.success && result.order) {
    lastOrder = {
      ...result.order,
      items: normalizeCart(result.order.items),
    };
  }

  return result;
}

export function getLastOrder() {
  if (USE_MOCK) return mockApi.getLastOrder();
  return lastOrder;
}

export async function getCartSnapshot() {
  const result = await getCart();
  return result.success ? result.cart : [];
}

export function resetCart() {
  if (USE_MOCK) mockApi.resetCart();
}

/**
 * Send a raw transcript to the backend NLP endpoint.
 * The backend tries Groq first and falls back to the regex parser.
 *
 * Returns: { intent, fallback? }
 *   intent   — the parsed intent object
 *   fallback — true when the regex fallback was used (Groq unavailable)
 *
 * Throws if the backend itself is unreachable (caller handles the local fallback).
 */
export async function parseTranscript(transcript) {
  const result = await request("/nlp/parse", {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });

  if (!result.success) {
    throw new Error(result.error || "NLP parse failed");
  }

  return { intent: result.intent, fallback: result.fallback === true };
}
