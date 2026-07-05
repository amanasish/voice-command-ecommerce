import { createContext, useContext, useState, useCallback } from "react";
import { getCart } from "../api/apiClient.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const updateCartFromResult = useCallback((result) => {
    if (Array.isArray(result?.cart)) {
      setCartItems(result.cart);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }
    const result = await getCart();
    if (result.success) {
      setCartItems(result.cart || []);
    }
  }, [isLoggedIn]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const cartCount = isLoggedIn
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const lastCartProductId =
    cartItems.length > 0 ? cartItems[cartItems.length - 1].productId : null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartOpen,
        lastCartProductId,
        refreshCart,
        updateCartFromResult,
        openCart,
        closeCart,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
