// server.js
// Entry point for the backend API

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const authRoutes = require("./routes/authRoutes"); // Authentication routes

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
// Example:
// public/images/p101.jpg
// -> http://localhost:3000/images/p101.jpg
app.use(express.static("public"));

// Routes
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is alive and running!",
  });
});

const PORT = process.env.PORT || 3000;

// Connect MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();