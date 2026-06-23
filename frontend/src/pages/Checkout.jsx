import { useVoice } from "../context/VoiceContext.jsx";
import { dummyUser } from "../data/dummyProducts.js";
import { getLastOrder } from "../api/mockApi.js";

export default function Checkout() {
  const { lastResult, processTranscript } = useVoice();
  const order = lastResult?.order || getLastOrder();

  return (
    <main className="page checkout-page">
      <h1>Checkout</h1>

      <section className="checkout-form">
        <h2>Shipping Details</h2>
        <div className="form-grid">
          <label>
            Name
            <input type="text" value={dummyUser.name} readOnly />
          </label>
          <label>
            Email
            <input type="email" value={dummyUser.email} readOnly />
          </label>
          <label>
            Phone
            <input type="tel" value={dummyUser.phone} readOnly />
          </label>
          <label className="full-width">
            Address
            <textarea value={dummyUser.address} readOnly rows={2} />
          </label>
        </div>
      </section>

      {order ? (
        <section className="order-confirmation">
          <h2>Order Confirmed</h2>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.total.toLocaleString("en-IN")}
          </p>
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.title} × {item.quantity} — ₹
                {(item.price * item.quantity).toLocaleString("en-IN")}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="checkout-actions">
          <p>Add items to your cart, then say &quot;checkout&quot; or click below.</p>
          <button className="btn-primary" onClick={() => processTranscript("checkout")}>
            Place Order
          </button>
        </section>
      )}
    </main>
  );
}
