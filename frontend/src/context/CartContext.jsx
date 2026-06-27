import { createContext, useContext, useState, useCallback } from "react";
import { getCart } from "../api/apiClient.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const updateCartFromResult = useCallback((result) => {
    if (Array.isArray(result?.cart)) {
      setCartItems(result.cart);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    const result = await getCart();
    if (result.success) {
      setCartItems(result.cart || []);
    }
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
