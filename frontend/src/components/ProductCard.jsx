import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { addToCart } from "../api/mockApi.js";

export default function ProductCard({ product }) {
  const { selectProduct, selectedProductId } = useProducts();
  const { refreshCart } = useCart();

  const isSelected = selectedProductId === product.id;

  const handleAddToCart = async () => {
    selectProduct(product.id);
    const result = addToCart({ productId: product.id, quantity: 1 });
    if (result.success) {
      refreshCart();
    }
  };

  const handleSelect = () => {
    selectProduct(product.id);
  };

  return (
    <article className={`product-card ${isSelected ? "selected" : ""}`}>
      <img src={product.imageUrl} alt={product.title} />
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="product-meta">
          {product.category} · {product.color}
        </p>
        <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
        <div className="product-actions">
          <button className="btn-secondary" onClick={handleSelect}>
            {isSelected ? "Selected" : "Select"}
          </button>
          <button className="btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
