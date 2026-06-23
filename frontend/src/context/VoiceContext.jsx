import { createContext, useContext, useState, useCallback } from "react";
import { parse } from "../nlp/parserTypes.js";
import { executeIntent } from "../api/intentRouter.js";
import { useCart } from "./CartContext.jsx";
import { useProducts } from "./ProductContext.jsx";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const { refreshCart, openCart, lastCartProductId } = useCart();
  const { setProducts, selectedProductId } = useProducts();

  const [lastIntent, setLastIntent] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const processTranscript = useCallback(
    async (transcript) => {
      if (!transcript?.trim()) {
        setFeedback({ type: "error", message: "No speech detected. Try again." });
        return;
      }

      setProcessing(true);
      setFeedback(null);

      try {
        const intent = await parse(transcript.trim());
        setLastIntent(intent);

        const result = await executeIntent(intent, {
          selectedProductId,
          lastCartProductId,
        });
        setLastResult(result);

        if (!result.success) {
          setFeedback({ type: "error", message: result.error });
          return;
        }

        switch (intent.action) {
          case "filter":
            setProducts(result.products);
            setFeedback({
              type: "success",
              message: `Found ${result.products.length} product(s)`,
            });
            break;
          case "addToCart":
          case "removeFromCart":
            refreshCart();
            setFeedback({
              type: "success",
              message:
                intent.action === "addToCart"
                  ? "Item added to cart"
                  : "Item removed from cart",
            });
            break;
          case "viewCart":
            refreshCart();
            openCart();
            setFeedback({ type: "success", message: "Showing your cart" });
            break;
          case "checkout":
            refreshCart();
            setFeedback({
              type: "success",
              message: `Order placed! ID: ${result.order.orderId}`,
            });
            break;
          default:
            setFeedback({ type: "success", message: "Command processed" });
        }
      } catch (err) {
        setFeedback({ type: "error", message: err.message || "Processing failed" });
      } finally {
        setProcessing(false);
      }
    },
    [selectedProductId, lastCartProductId, refreshCart, openCart, setProducts]
  );

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return (
    <VoiceContext.Provider
      value={{
        lastIntent,
        lastResult,
        processing,
        feedback,
        processTranscript,
        clearFeedback,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}

export default VoiceContext;
