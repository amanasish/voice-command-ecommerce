// controllers/productController.js
//
// MONGODB VERSION -- ab yeh database se actual data fetch karta hai,
// hardcoded array se nahi.
//
// MAPPING LAYER: Database se aaya data DIRECTLY response mein nahi
// bhej rahe. Hum explicitly har field map kar rahe hain, taaki:
//   1. "_id" (MongoDB internal) response mein expose NAHI hota
//   2. "id" (custom field, jaise "p101") hi response mein jaata hai
//   3. "stock" exclude hai response se (kyunki kabhi update nahi hota,
//      misleading hota agar dikhaya jaaye)

const Product = require("../models/Product");

const mapProductToResponse = (product) => ({
  id: product.id,
  title: product.title,
  category: product.category,
  color: product.color,
  price: product.price,
  imageUrl: product.imageUrl
  // stock: product.stock  <-- jab decrement logic ban jaaye, isse uncomment karna
});

// POST /products/filter
const filterProducts = async (req, res) => {
  try {

    // STEP 1: Read everything from the JSON body
    const { action, category, color, priceMax } = req.body;

    // STEP 2: Validate the action field.
    if (!action) {
      return res.status(400).json({
        success: false,
        error: "action field is required"
      });
    }

    if (action !== "filter") {
      return res.status(400).json({
        success: false,
        error: 'This endpoint only supports action "filter"'
      });
    }

    // STEP 3: Build MongoDB query object
    const query = {};

    if (category) {
      // "i" flag = case-insensitive matching
      query.category = new RegExp(`^${category.trim()}$`, "i");
    }

    if (color) {
      query.color = new RegExp(`^${color.trim()}$`, "i");
    }

    if (priceMax !== undefined && priceMax !== null) {
      const maxPriceNumber = Number(priceMax);

      if (isNaN(maxPriceNumber)) {
        return res.status(400).json({
          success: false,
          error: "priceMax must be a valid number"
        });
      }

      // $lte = "less than or equal to" -- MongoDB operator
      query.price = { $lte: maxPriceNumber };
    }

    // STEP 4: Actually query the database
    const productsFromDB = await Product.find(query);

    // STEP 5: Map database documents to clean API response shape
    const responseProducts = productsFromDB.map(mapProductToResponse);

    // STEP 6: Send response exactly as defined in API Contract
    return res.status(200).json({
      success: true,
      products: responseProducts
    });

  } catch (error) {

    console.error("Filter Products Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

module.exports = {
  filterProducts
};