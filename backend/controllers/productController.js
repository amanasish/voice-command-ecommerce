const Product = require("../models/Product");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const mapProductToResponse = (product) => ({
  id: product.id,
  title: product.title,
  category: product.category,
  occasion: product.occasion,
  color: product.color,
  price: product.price,
  imageUrl: product.imageUrl,
});

const filterProducts = async (req, res) => {
  try {
    const {
      action,
      category,
      occasion,
      color,
      priceMin,
      priceMax,
    } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: "action field is required",
      });
    }

    if (action !== "filter") {
      return res.status(400).json({
        success: false,
        error: 'This endpoint only supports action "filter"',
      });
    }

    const query = {};

    // Category filter
    if (category) {
      query.category = new RegExp(
        `^${escapeRegex(category.trim())}$`,
        "i"
      );
    }

    // Occasion filter
    if (occasion) {
      query.occasion = {
        $in: [new RegExp(`^${escapeRegex(occasion.trim())}$`, "i")],
      };
    }

    // Color filter
    if (color) {
      query.color = new RegExp(
        `^${escapeRegex(color.trim())}$`,
        "i"
      );
    }

    // Minimum price filter
    if (priceMin !== undefined && priceMin !== null) {
      const minPriceNumber = Number(priceMin);

      if (isNaN(minPriceNumber)) {
        return res.status(400).json({
          success: false,
          error: "priceMin must be a valid number",
        });
      }

      query.price = {
        ...(query.price || {}),
        $gte: minPriceNumber,
      };
    }

    // Maximum price filter
    if (priceMax !== undefined && priceMax !== null) {
      const maxPriceNumber = Number(priceMax);

      if (isNaN(maxPriceNumber)) {
        return res.status(400).json({
          success: false,
          error: "priceMax must be a valid number",
        });
      }

      query.price = {
        ...(query.price || {}),
        $lte: maxPriceNumber,
      };
    }

    const productsFromDB = await Product.find(query);

    const responseProducts = productsFromDB.map(mapProductToResponse);

    return res.status(200).json({
      success: true,
      products: responseProducts,
    });
  } catch (error) {
    console.error("Filter Products Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  filterProducts,
};
