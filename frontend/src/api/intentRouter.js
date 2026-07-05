import {
  filterProducts,
  addToCart,
  removeFromCart,
  getCart,
  checkout,
} from "./apiClient.js";
import { getAuthToken } from "./authApi.js";

export async function executeIntent(intent, context = {}) {
  if (!intent?.action) {
    return { success: false, error: "Could not understand command. Try again." };
  }

  switch (intent.action) {
    case "filter":
      return filterProducts(intent);

    case "addToCart": {
      const productId = intent.productId || context.selectedProductId;
      if (!productId) {
        return {
          success: false,
          error: "No product selected. Say a product ID or select a product first.",
        };
      }
      return addToCart({ productId, quantity: intent.quantity || 1 });
    }

    case "removeFromCart": {
      const productId =
        intent.productId || context.lastCartProductId;
      if (!productId) {
        return { success: false, error: "No item to remove from cart." };
      }
      return removeFromCart({ productId });
    }

    case "viewCart":
      if (!getAuthToken()) {
        return {
          success: false,
          error: "Please log in to view your cart.",
        };
      }
      return getCart();

    case "checkout":
      if (!getAuthToken()) {
        return {
          success: false,
          error: "Please log in to checkout.",
        };
      }
      return checkout();

    default:
      return { success: false, error: `Unknown action: ${intent.action}` };
  }
}
