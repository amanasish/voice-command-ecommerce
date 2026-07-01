import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Voice Commerce
      </Link>
      <nav>
        <Link to="/">Shop</Link>
        <Link to="/checkout">Checkout</Link>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          Cart ({cartCount})
        </button>
      </nav>
    </header>
  );
}
