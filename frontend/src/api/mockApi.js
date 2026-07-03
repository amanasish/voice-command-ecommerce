import { dummyProducts } from "../data/dummyProducts.js";

let cart = [];
let lastOrder = null;

function findProduct(productId) {
  return dummyProducts.find((p) => p.id === productId);
}

function enrichCartItems() {
  return cart
    .map((item) => {
      const product = findProduct(item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      };
    })
    .filter(Boolean);
}

function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function filterProducts(intent) {
  let results = [...dummyProducts];

  if (intent.category) {
    results = results.filter((p) => p.category === intent.category);
  }
  if (intent.color) {
    results = results.filter((p) => p.color === intent.color);
  }
  if (intent.priceMin != null) {
    results = results.filter((p) => p.price >= intent.priceMin);
  }
  if (intent.priceMax != null) {
    results = results.filter((p) => p.price <= intent.priceMax);
  }

  return { success: true, products: results };
}

export function addToCart({ productId, quantity = 1 }) {
  const product = findProduct(productId);
  if (!product) {
    return { success: false, error: `Product ${productId} not found` };
  }
  if (product.stock < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  const items = enrichCartItems();
  return { success: true, cart: items, total: cartTotal(items) };
}

export function removeFromCart({ productId }) {
  const index = cart.findIndex((item) => item.productId === productId);
  if (index === -1) {
    return { success: false, error: "Item not in cart" };
  }
  cart.splice(index, 1);

  const items = enrichCartItems();
  return { success: true, cart: items, total: cartTotal(items) };
}

export function getCart() {
  const items = enrichCartItems();
  return { success: true, cart: items, total: cartTotal(items) };
}

export function checkout() {
  const items = enrichCartItems();
  if (items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  const total = cartTotal(items);
  lastOrder = {
    orderId: `ORD${Date.now()}`,
    items: [...items],
    total,
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  cart = [];
  return {
    success: true,
    message: "Order placed successfully",
    order: lastOrder,
  };
}

export function getLastOrder() {
  return lastOrder;
}

export function getCartSnapshot() {
  return enrichCartItems();
}

export function resetCart() {
  cart = [];
}
