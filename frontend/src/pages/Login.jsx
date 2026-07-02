import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    background:
      "radial-gradient(circle at top left, rgba(76, 29, 149, 0.18), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  },
  panel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  hero: {
    color: "#fff",
    borderRadius: "28px",
    padding: "3rem",
    maxWidth: "540px",
    background:
      "linear-gradient(145deg, rgba(76, 29, 149, 0.98), rgba(91, 33, 182, 0.92))",
    boxShadow: "0 25px 60px rgba(76, 29, 149, 0.28)",
  },
  heroBadge: {
    display: "inline-flex",
    padding: "0.45rem 0.85rem",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    color: "#ddd6fe",
    fontSize: "0.85rem",
    marginBottom: "1.1rem",
  },
  heroTitle: {
    margin: 0,
    fontSize: "3rem",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  heroText: {
    marginTop: "1rem",
    maxWidth: "38ch",
    color: "rgba(255,255,255,0.82)",
    fontSize: "1.05rem",
  },
  formCard: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    color: "#0f172a",
  },
  subtitle: {
    margin: "0.4rem 0 0",
    color: "#64748b",
  },
  field: {
    marginTop: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.35rem",
    color: "#334155",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "0.9rem 1rem",
    outline: "none",
    background: "#fff",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginTop: "0.85rem",
    color: "#475569",
    fontSize: "0.92rem",
  },
  button: {
    width: "100%",
    marginTop: "1.35rem",
    borderRadius: "14px",
    padding: "0.95rem 1rem",
    background: "linear-gradient(135deg, #4c1d95, #7c3aed)",
    color: "#fff",
    fontWeight: 700,
    border: "none",
  },
  footer: {
    marginTop: "1rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.95rem",
  },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect back to the page the user originally tried to visit, or home
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });
      // Sync global auth state, then navigate to intended destination
      login(result);
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <section style={styles.panel}>
        <div style={styles.hero}>
          <span style={styles.heroBadge}>Welcome back</span>
          <h1 style={styles.heroTitle}>Login to your voice commerce account</h1>
          <p style={styles.heroText}>
            Access your cart, continue shopping, and use the voice parser to
            search products faster.
          </p>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Enter your details to continue.</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                style={styles.input}
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                style={styles.input}
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div style={styles.row}>
              <label style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <Link to="/" style={{ color: "#4c1d95", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message ? (
            <p style={{ marginTop: "1rem", color: "#4c1d95", fontWeight: 600 }}>
              {message}
            </p>
          ) : null}

          <p style={styles.footer}>
            New here? <Link to="/register" style={{ color: "#4c1d95", fontWeight: 700 }}>Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
