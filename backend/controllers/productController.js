// controllers/productController.js
//
// UPDATED FOR API CONTRACT v0.2
//
// What changed from before:
//   - Old endpoint was GET /products
//   - New endpoint (per contract v0.2) is POST /products/filter
//   - The request body now includes an "action" field (always "filter" here)
//   - Field names (category, color, priceMax) stay the same as before --
//     the contract explicitly says "field names must remain unchanged"

const products = require("../data/products");

// This function runs when: POST /products/filter is called
// Expected request body (from contract v0.2):
//   {
//     "action": "filter",
//     "category": "shirts",
//     "color": "blue",
//     "priceMax": 1000
//   }
const filterProducts = (req, res) => {
  try {

    // STEP 1: Read everything from the JSON body (NOT query params anymore)
    const { action, category, color, priceMax } = req.body;

    // STEP 2: Validate the action field.
    // The contract marks "action" as REQUIRED.
    // This endpoint should only ever receive action = "filter".
    if (!action) {
      return res.status(400).json({
        success: false,
        message: "action field is required"
      });
    }

    // Reject unsupported actions.
    // Examples:
    //   addToCart
    //   removeFromCart
    //   checkout
    if (action !== "filter") {
      return res.status(400).json({
        success: false,
        message: 'This endpoint only supports action "filter"'
      });
    }

    // STEP 3: Start with the complete product list.
    // Every filter below will gradually narrow this list down.
    let filteredProducts = products;

    // STEP 4: Apply category filter.
    // trim() removes accidental spaces from NLP output.
    // Example:
    //   " shirts " -> "shirts"
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === category.trim().toLowerCase()
      );
    }

    // STEP 5: Apply color filter.
    // trim() removes accidental spaces from NLP output.
    // Example:
    //   " blue " -> "blue"
    if (color) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.color.toLowerCase() === color.trim().toLowerCase()
      );
    }

    // STEP 6: Apply maximum price filter.
    //
    // Using !== undefined/null because:
    // priceMax = 0 is technically valid.
    // if(priceMax) would incorrectly skip 0.
    if (priceMax !== undefined && priceMax !== null) {

      const maxPriceNumber = Number(priceMax);

      // Validate that priceMax is actually a number.
      // Example:
      //   "1000" -> valid
      //   "abc"  -> invalid
      if (isNaN(maxPriceNumber)) {
        return res.status(400).json({
          success: false,
          message: "priceMax must be a valid number"
        });
      }

      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPriceNumber
      );
    }

    // STEP 7: Send response exactly as defined in API Contract v0.2
    return res.status(200).json({
      success: true,
      products: filteredProducts
    });

  } catch (error) {

    console.error("Filter Products Error:", error);

    // Generic server error response.
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// Export controller function for use in routes/productRoutes.js
module.exports = {
  filterProducts
};