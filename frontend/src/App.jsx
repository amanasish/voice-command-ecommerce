import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { VoiceProvider } from "./context/VoiceContext.jsx";
import Navbar from "./components/Navbar.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import FeedbackBanner from "./components/FeedbackBanner.jsx";
import Home from "./pages/Home.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";

function AppShell() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <FeedbackBanner />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <VoiceProvider>
            <AppShell />
          </VoiceProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
