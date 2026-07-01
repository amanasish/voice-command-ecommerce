
// controllers/checkoutController.js
//
// Checkout Controller
// Saves order in MongoDB and clears the user's cart.

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const DEMO_USER_ID = "u101";

const checkout = async (req, res) => {
  try {
    const { action } = req.body;

    // Validate action
    if (!action) {
      return res.status(400).json({
        success: false,
        error: "action field is required",
      });
    }

    if (action !== "checkout") {
      return res.status(400).json({
        success: false,
        error: `This endpoint only supports action "checkout", received "${action}"`,
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId: DEMO_USER_ID });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty, nothing to checkout",
      });
    }

    // Build order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findOne({ id: item.productId });

      if (!product) continue;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Save order
    const order = await Order.create({
      userId: DEMO_USER_ID,
      items: orderItems,
      totalAmount,
      status: "placed",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return res.json({
      success: true,
      message: "Order placed successfully",
      order: {
        orderId: order._id,
        items: orderItems,
        total: totalAmount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Checkout Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = { checkout };

