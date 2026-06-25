// controllers/productController.js
//
// FIXED FOR API CONTRACT v0.5, UPDATED FOR v0.6
//
// v0.5 fix: error responses use "error" field (not "message"), per
// the Standard Error Response format.
//
// v0.6 DECISION UPDATE: "stock" exists in data/products.js (matching
// the contract's database schema), but it is intentionally EXCLUDED
// from the /products/filter response. Reason: addToCart/checkout do
// NOT decrement stock in this MVP, so showing a number that never
// changes would be misleading to the user (e.g. "5 left" stays "5 left"
// even after someone buys it). Once decrement logic is added, stock can
// be re-included in the response mapping below.

const products = require("../data/products");

// This function runs when: POST /products/filter is called
const filterProducts = (req, res) => {
  try {

    // STEP 1: Read everything from the JSON body
    const { action, category, color, priceMax } = req.body;

    // STEP 2: Validate the action field.
    // The contract marks "action" as REQUIRED.
    if (!action) {
      return res.status(400).json({
        success: false,
        error: "action field is required"
      });
    }

    // Reject unsupported actions.
    if (action !== "filter") {
      return res.status(400).json({
        success: false,
        error: 'This endpoint only supports action "filter"'
      });
    }

    // STEP 3: Start with the complete product list.
    let filteredProducts = products;

    // STEP 4: Apply category filter.
    // trim() removes accidental spaces from NLP output.
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === category.trim().toLowerCase()
      );
    }

    // STEP 5: Apply color filter.
    if (color) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.color.toLowerCase() === color.trim().toLowerCase()
      );
    }

    // STEP 6: Apply maximum price filter.
    // Using !== undefined/null because priceMax = 0 is technically valid.
    if (priceMax !== undefined && priceMax !== null) {

      const maxPriceNumber = Number(priceMax);

      // Validate that priceMax is actually a number.
      if (isNaN(maxPriceNumber)) {
        return res.status(400).json({
          success: false,
          error: "priceMax must be a valid number"
        });
      }

      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPriceNumber
      );
    }

    // STEP 7: Map to response shape, EXCLUDING "stock" (see decision
    // note above). This keeps data/products.js as the single source of
    // truth (with stock for future use), while the API response stays
    // honest about what info is actually live/accurate right now.
    const responseProducts = filteredProducts.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      color: product.color,
      price: product.price,
      imageUrl: product.imageUrl
      // stock: product.stock  <-- uncomment once decrement logic exists
    }));

    // STEP 8: Send response exactly as defined in API Contract v0.5
    return res.status(200).json({
      success: true,
      products: responseProducts
    });

  } catch (error) {

    console.error("Filter Products Error:", error);

    // Generic server error response -- also uses "error" field now
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

// Export controller function for use in routes/productRoutes.js
module.exports = {
  filterProducts
};