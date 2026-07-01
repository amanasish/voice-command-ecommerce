const cart = require("../data/cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { action, productId, quantity } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: "action field is required",
      });
    }

    if (action !== "addToCart") {
      return res.status(400).json({
        success: false,
        error: `This endpoint only supports action "addToCart", received "${action}"`,
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "productId is required",
      });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity || 1,
      });
    }

    res.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const removeFromCart = (req, res) => {
  const { action, productId } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      error: "action field is required",
    });
  }

  if (action !== "removeFromCart") {
    return res.status(400).json({
      success: false,
      error: `This endpoint only supports action "removeFromCart", received "${action}"`,
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "productId is required",
    });
  }

  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Item not in cart",
    });
  }

  cart.splice(itemIndex, 1);

  res.json({
    success: true,
    cart: cart,
  });
};

const getCart = (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    success: true,
    cart: cart,
    total: total,
  });
};

module.exports = { addToCart, removeFromCart, getCart };
