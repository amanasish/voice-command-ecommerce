// controllers/productController.js
//
// WHAT IS A "CONTROLLER"?
// A controller is just a function that contains the ACTUAL LOGIC of what
// should happen when a particular API is called.
//
// Why separate it from routes?
// - routes/productRoutes.js  -> only decides "which URL triggers which function"
// - controllers/productController.js -> the function itself, doing the real work
//
// This separation means: if tomorrow your logic gets complex (e.g. talking to
// MongoDB, sorting, pagination), you only touch this file. Your routes file
// never needs to change. This is exactly what your team lead meant by
// "controller design."

const products = require("../data/products");
// ^ We import the product array from data/products.js
//   "../" means "go up one folder, then into data/products.js"

// This function will run whenever someone calls: GET /products
// It receives two important objects from Express automatically:
//   req  -> the incoming "request" (contains what the caller sent)
//   res  -> the "response" tool we use to send data back
const getProducts = (req, res) => {

  // STEP 1: Read query parameters from the URL
  // Example incoming URL (exactly as per contract):
  //   /products?category=shirts&color=blue&priceMax=1000
  //
  // Express automatically puts everything after "?" into req.query
  // as a plain object, like:
  //   { category: "shirts", color: "blue", priceMax: "1000" }
  const { category, color, priceMax } = req.query;

  // STEP 2: Start with the full product list, then narrow it down
  let filteredProducts = products;

  // STEP 3: Apply category filter, only if it was provided in the URL
  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
    // .toLowerCase() makes sure "Shirts" and "shirts" both match correctly,
    // since voice/NLP output might not always match exact casing.
  }

  // STEP 4: Apply color filter, only if provided
  if (color) {
    filteredProducts = filteredProducts.filter(
      (product) => product.color.toLowerCase() === color.toLowerCase()
    );
  }

  // STEP 5: Apply price filter, only if provided
  // Note: query params arrive as STRINGS, even numbers like "1000".
  // We must convert it to a real number using Number(), otherwise
  // comparisons like 899 <= "1000" can behave unexpectedly.
  if (priceMax) {
    const maxPriceNumber = Number(priceMax);
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPriceNumber
    );
  }

  // STEP 6: Send the response back in EXACTLY the shape the contract defines:
  //   { "success": true, "products": [...] }
  res.json({
    success: true,
    products: filteredProducts
  });
};

// Export this function so routes/productRoutes.js can use it
module.exports = { getProducts };