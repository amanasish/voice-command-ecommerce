import { createContext, useContext, useState, useCallback } from "react";
import { dummyProducts } from "../data/dummyProducts.js";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(dummyProducts);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchLabel, setSearchLabel] = useState("All products");
  const [scrollTrigger, setScrollTrigger] = useState(0);

  const selectProduct = useCallback((productId) => {
    setSelectedProductId(productId);
  }, []);

  const requestScrollToProducts = useCallback(() => {
    setScrollTrigger((n) => n + 1);
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        selectedProductId,
        selectProduct,
        searchLabel,
        setSearchLabel,
        scrollTrigger,
        requestScrollToProducts,
      }}
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
