import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { parse } from "../nlp/parserTypes.js";
import { executeIntent } from "../api/intentRouter.js";
import { applyActionResult } from "../api/actionHandlers.js";
import { useCart } from "./CartContext.jsx";
import { useProducts } from "./ProductContext.jsx";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const navigate = useNavigate();
  const { lastCartProductId, updateCartFromResult, openCart } = useCart();
  const {
    setProducts,
    selectedProductId,
    setSearchLabel,
    requestScrollToProducts,
  } = useProducts();

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

        const feedbackResult = await applyActionResult(intent, result, {
          setProducts,
          setSearchLabel,
          updateCartFromResult,
          openCart,
          navigate,
          requestScrollToProducts,
        });
        setFeedback(feedbackResult);
      } catch (err) {
        setFeedback({ type: "error", message: err.message || "Processing failed" });
      } finally {
        setProcessing(false);
      }
    },
    [
      selectedProductId,
      lastCartProductId,
      updateCartFromResult,
      openCart,
      setProducts,
      setSearchLabel,
      requestScrollToProducts,
      navigate,
    ]
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
