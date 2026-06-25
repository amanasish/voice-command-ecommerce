// controllers/checkoutController.js
//
// FIXED FOR API CONTRACT v0.5
// Sirf error format change hua hai: "message" se "error".

const cart = require("../data/cart");

// Yeh function chalega jab: POST /checkout call hoga
// Expected request body: { "action": "checkout" }
const checkout = (req, res) => {

  const { action } = req.body;

  // STEP 1: action field check karo
  if (!action) {
    return res.status(400).json({
      success: false,
      error: "action field is required"
    });
  }

  if (action !== "checkout") {
    return res.status(400).json({
      success: false,
      error: `This endpoint only supports action "checkout", received "${action}"`
    });
  }

  // STEP 2: Agar cart khali hai, checkout allow nahi karo.
  if (cart.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Cart is empty, nothing to checkout"
    });
  }

  // STEP 3: Total price calculate karo
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // STEP 4: Order ka summary banao.
  const orderSummary = {
    orderId: "ORD" + Date.now(),
    items: [...cart],
    total: total
  };

  // STEP 5: Checkout ke baad cart khali kar do
  cart.length = 0;

  // NOTE: Yeh success response hai, isliye "message" field rakhna theek
  // hai -- contract ka "error" field sirf success: false ke saath chahiye.
  res.json({
    success: true,
    message: "Order placed successfully",
    order: orderSummary
  });
};

module.exports = { checkout };