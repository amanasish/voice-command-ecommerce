// server.js
//
// THIS IS THE ENTRY POINT OF YOUR ENTIRE BACKEND.
// When you run "node server.js", THIS file runs first, and it pulls in
// everything else (routes -> controllers -> data) like a chain.

// STEP 0: Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import MongoDB connection function
const connectDB = require("./config/db");

// STEP 1: Create the Express application
const app = express();

// STEP 1.5: Connect to MongoDB BEFORE handling requests
connectDB();

// STEP 2: Add "middleware"
// Middleware = code that runs on EVERY request, BEFORE it reaches your routes.
// Think of it as security/setup checks at the entrance of a building,
// before visitors reach any specific room (route).

// cors() -- Without this, if your frontend (running on a different port,
// e.g. localhost:3001 for React) tries to call your backend
// (localhost:3000), the BROWSER will BLOCK it for security reasons.
// This is called a CORS error and it's one of the most common beginner
// errors in full-stack projects. Adding cors() here prevents that.
app.use(cors());

// express.json() -- Without this, if someone sends you JSON data in a
// POST request body, req.body would be "undefined". This middleware reads
// incoming JSON and makes it usable as a normal JavaScript object.
app.use(express.json());

// STEP 3: Import our routes files
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

// STEP 4: "Mount" each routes file at its own base path
// This means: any URL starting with /products goes to productRoutes,
// any URL starting with /cart goes to cartRoutes, and any URL starting
// with /checkout goes to checkoutRoutes.
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

// STEP 5: A simple health-check route at the root URL.
// This is NOT in the contract -- it's just a way for YOU (and your team)
// to quickly check "is the server even alive?" by visiting localhost:3000
app.get("/", (req, res) => {
  res.json({ message: "Backend is alive and running!" });
});

// STEP 6: Choose the port and start listening
// process.env.PORT lets this work on hosting platforms later (like Render
// or Railway) which assign their own port number automatically. If that's
// not set (like on your own laptop), it falls back to 3000.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});