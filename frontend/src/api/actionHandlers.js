export function buildSearchLabel(intent) {
  const parts = [];
  if (intent.color) parts.push(intent.color);
  if (intent.category) parts.push(intent.category);
  if (intent.priceMax != null) parts.push(`under ₹${intent.priceMax}`);
  return parts.length ? parts.join(" ") : "All products";
}

export async function applyActionResult(intent, result, helpers) {
  const {
    setProducts,
    setSearchLabel,
    updateCartFromResult,
    openCart,
    navigate,
    requestScrollToProducts,
  } = helpers;

  if (!result.success) {
    return { type: "error", message: result.error };
  }

  switch (intent.action) {
    case "filter":
      setProducts(result.products);
      setSearchLabel(buildSearchLabel(intent));
      requestScrollToProducts?.();
      return {
        type: "success",
        message: `Found ${result.products.length} product(s)`,
      };

    case "addToCart":
      updateCartFromResult(result);
      return { type: "success", message: "Item added to cart" };

    case "removeFromCart":
      updateCartFromResult(result);
      return { type: "success", message: "Item removed from cart" };

    case "viewCart":
      updateCartFromResult(result);
      openCart();
      return { type: "success", message: "Showing your cart" };

    case "checkout":
      updateCartFromResult({ cart: [] });
      navigate?.("/checkout");
      return {
        type: "success",
        message: `Order placed! ID: ${result.order.orderId}`,
      };

    default:
      return { type: "success", message: "Command processed" };
  }
}
