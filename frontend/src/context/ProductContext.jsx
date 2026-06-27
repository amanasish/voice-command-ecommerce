import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { dummyProducts } from "../data/dummyProducts.js";
import { filterProducts } from "../api/apiClient.js";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(USE_MOCK ? dummyProducts : []);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchLabel, setSearchLabel] = useState("All products");
  const [scrollTrigger, setScrollTrigger] = useState(0);

  useEffect(() => {
    if (!USE_MOCK) {
      filterProducts({ action: "filter" }).then((result) => {
        if (result.success) setProducts(result.products);
      });
    }
  }, []);

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
