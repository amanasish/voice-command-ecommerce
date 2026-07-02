
// controllers/cartController.js

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const DEMO_USER_ID = "u101";

// ============================================================
// Helper Function
// Returns cart with product details + total
// ============================================================

const buildCartResponse = async (cart) => {
  if (!cart || cart.items.length === 0) {
    return {
      cart: [],
      total: 0,
    };
  }

  let total = 0;
  const cartWithDetails = [];

  for (const item of cart.items) {
    const product = await Product.findOne({ id: item.productId });

    if (product) {
      total += product.price * item.quantity;

      cartWithDetails.push({
        productId: item.productId,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
      });
    }
  }

  return {
    cart: cartWithDetails,
    total,
  };
};

// ============================================================
// Add To Cart
// ============================================================

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

    let cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart) {
      cart = new Cart({
        userId: DEMO_USER_ID,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity ?? 1;
    } else {
      cart.items.push({
        productId,
        quantity: quantity ?? 1,
      });
    }

    await cart.save();

    const response = await buildCartResponse(cart);

    res.json({
      success: true,
      cart: response.cart,
      total: response.total,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// ============================================================
// Remove From Cart
// ============================================================

const removeFromCart = async (req, res) => {
  try {
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

    const cart = await Cart.findOne({
      userId: DEMO_USER_ID,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not in cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    const response = await buildCartResponse(cart);

    res.json({
      success: true,
      cart: response.cart,
      total: response.total,
    });
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// ============================================================
// Get Cart
// ============================================================

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: DEMO_USER_ID,
    });

    const response = await buildCartResponse(cart);

    res.json({
      success: true,
      cart: response.cart,
      total: response.total,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};

