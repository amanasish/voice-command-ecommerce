import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "0.95fr 1.05fr",
    background:
      "radial-gradient(circle at top right, rgba(124, 58, 237, 0.16), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)",
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
      "linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(76, 29, 149, 0.9))",
    boxShadow: "0 25px 60px rgba(15, 23, 42, 0.22)",
  },
  heroBadge: {
    display: "inline-flex",
    padding: "0.45rem 0.85rem",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    color: "#cbd5e1",
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
    color: "rgba(255,255,255,0.84)",
    fontSize: "1.05rem",
  },
  formCard: {
    width: "100%",
    maxWidth: "520px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  button: {
    width: "100%",
    marginTop: "1.35rem",
    borderRadius: "14px",
    padding: "0.95rem 1rem",
    background: "linear-gradient(135deg, #0f172a, #4c1d95)",
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

export default function Register() {
  return (
    <div style={styles.page}>
      <section style={styles.panel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Join the store and start using voice search.</p>

          <form>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Aman"
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Gupta"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Create account
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4c1d95", fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section style={styles.panel}>
        <div style={styles.hero}>
          <span style={styles.heroBadge}>Start here</span>
          <h1 style={styles.heroTitle}>Register for a faster shopping experience</h1>
          <p style={styles.heroText}>
            Save your details, manage orders, and use the AI parser to find
            products with natural voice commands.
          </p>
        </div>
      </section>
    </div>
  );
}
