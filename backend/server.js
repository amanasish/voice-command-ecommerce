// server.js
//
// THIS IS THE ENTRY POINT OF YOUR ENTIRE BACKEND.
// When you run "node server.js", THIS file runs first, and it pulls in
// everything else (routes -> controllers -> data) like a chain.

const express = require("express");
const cors = require("cors");

// STEP 1: Create the Express application
const app = express();

// STEP 2: Add middleware
app.use(cors());
app.use(express.json());

// STEP 3: Import our routes files
const productRoutes = require("./routes/productRoutes");

// STEP 4: Mount routes
app.use("/products", productRoutes);

// STEP 5: Health-check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is alive and running!" });
});

// STEP 6: Choose the port and start listening
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});