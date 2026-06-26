import { useEffect, useRef } from "react";
import VoiceControl from "../components/VoiceControl.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useProducts } from "../context/ProductContext.jsx";

export default function Home() {
  const { products, searchLabel, scrollTrigger } = useProducts();
  const productsRef = useRef(null);

  useEffect(() => {
    if (scrollTrigger > 0) {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTrigger]);

  return (
    <main className="page home-page">
      <section className="hero">
        <h1>Voice-Controlled Shopping</h1>
        <p>Speak to search products, manage your cart, and checkout — hands free.</p>
      </section>

      <VoiceControl />

      <section className="products-section" ref={productsRef}>
        <h2>
          {searchLabel}{" "}
          <span className="product-count">({products.length} found)</span>
        </h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
