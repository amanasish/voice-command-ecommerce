// server.js — entry point for the backend API

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serves files inside the "public" folder directly via URL.
// Example: public/images/p101.jpg becomes accessible at:
//   http://localhost:3000/images/p101.jpg
app.use(express.static("public"));

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is alive and running!" });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();