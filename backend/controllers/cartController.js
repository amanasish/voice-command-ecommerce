// controllers/cartController.js
//
// FIXED FOR API CONTRACT v0.5
// Sirf error format change hua hai: "message" se "error".
// Baaki logic same hai.

const cart = require("../data/cart");
const products = require("../data/products");


// ============================================================
// FUNCTION 1: addToCart
// ============================================================
const addToCart = (req, res) => {

  const { action, productId, quantity } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      error: "action field is required"
    });
  }

  if (action !== "addToCart") {
    return res.status(400).json({
      success: false,
      error: `This endpoint only supports action "addToCart", received "${action}"`
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "productId is required"
    });
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: "Product not found"
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
      quantity: quantity || 1
    });
  }

  res.json({
    success: true,
    cart: cart
  });
};


// ============================================================
// FUNCTION 2: removeFromCart
// ============================================================
const removeFromCart = (req, res) => {

  const { action, productId } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      error: "action field is required"
    });
  }

  if (action !== "removeFromCart") {
    return res.status(400).json({
      success: false,
      error: `This endpoint only supports action "removeFromCart", received "${action}"`
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "productId is required"
    });
  }

  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Item not in cart"
    });
  }

  cart.splice(itemIndex, 1);

  res.json({
    success: true,
    cart: cart
  });
};


// ============================================================
// FUNCTION 3: getCart (viewCart action)
// ============================================================
const getCart = (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    success: true,
    cart: cart,
    total: total
  });
};

module.exports = { addToCart, removeFromCart, getCart };