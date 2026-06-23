import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useVoice } from "../context/VoiceContext.jsx";

export default function CartDrawer() {
  const { cartItems, cartOpen, closeCart } = useCart();
  const { processTranscript } = useVoice();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!cartOpen) return null;

  const handleCheckout = async () => {
    closeCart();
    await processTranscript("checkout");
    navigate("/checkout");
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={closeCart}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.title} />
                <div>
                  <p className="item-title">{item.title}</p>
                  <p className="item-meta">
                    Qty: {item.quantity} · ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-footer">
          <p className="cart-total">
            Total: <strong>₹{total.toLocaleString("en-IN")}</strong>
          </p>
          <button
            className="btn-primary"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
