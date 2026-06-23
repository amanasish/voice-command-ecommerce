import { createContext, useContext, useState, useCallback } from "react";
import { dummyProducts } from "../data/dummyProducts.js";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(dummyProducts);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const selectProduct = useCallback((productId) => {
    setSelectedProductId(productId);
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, setProducts, selectedProductId, selectProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}

export default ProductContext;
