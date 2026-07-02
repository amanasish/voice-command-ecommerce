import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        {isLoggedIn ? (
          <>
            <span className="navbar-user">Hi, {user.firstName}</span>
            <button className="navbar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-login-link">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
