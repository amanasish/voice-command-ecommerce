import VoiceControl from "../components/VoiceControl.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useProducts } from "../context/ProductContext.jsx";

export default function Home() {
  const { products } = useProducts();

  return (
    <main className="page home-page">
      <section className="hero">
        <h1>Voice-Controlled Shopping</h1>
        <p>Speak to search products, manage your cart, and checkout — hands free.</p>
      </section>

      <VoiceControl />

      <section className="products-section">
        <h2>Products</h2>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
