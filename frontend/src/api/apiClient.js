// Re-exports mock API for now. Swap to real backend calls here later:
// if (import.meta.env.VITE_USE_MOCK === "false") { ... axios to VITE_API_URL }
export {
  filterProducts,
  addToCart,
  removeFromCart,
  getCart,
  checkout,
  getLastOrder,
  getCartSnapshot,
} from "./mockApi.js";
