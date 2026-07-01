import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <p>No products match your search. Try a different voice command.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
