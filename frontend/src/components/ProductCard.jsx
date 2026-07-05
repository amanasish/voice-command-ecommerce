import { useProducts } from "../context/ProductContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addToCart } from "../api/apiClient.js";

export default function ProductCard({ product }) {
  const { selectProduct, selectedProductId } = useProducts();
  const { updateCartFromResult } = useCart();
  const { isLoggedIn } = useAuth();

  const isSelected = selectedProductId === product.id;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      return;
    }
    selectProduct(product.id);
    const result = await addToCart({ productId: product.id, quantity: 1 });
    if (result.success) {
      updateCartFromResult(result);
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
