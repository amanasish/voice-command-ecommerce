// routes/productRoutes.js
//
// WHAT IS A "ROUTE FILE"?
// This file's ONLY job is to say:
//   "When this URL is visited, run THIS controller function."
// It does NOT contain any logic itself -- that lives in the controller.
//
// Why bother separating this from server.js?
// Imagine later you have 15 different APIs (products, cart, checkout, etc).
// If you put them all directly in server.js, that file becomes huge and
// messy. Instead, each group of related routes gets its own file, and
// server.js just "plugs them in". This is what scales well in real projects.

const express = require("express");
const router = express.Router();
// express.Router() creates a "mini app" just for handling routes.
// We will attach this mini-router to our main app inside server.js.

const { filterProducts } = require("../controllers/productController");
// Importing the actual logic function we wrote in the controller file.

// Defining the route:
// Method: POST
// Path:   /filter  (this becomes /products/filter once we mount it in server.js)
// Handler: filterProducts function from our controller
router.post("/filter", filterProducts);

module.exports = router;