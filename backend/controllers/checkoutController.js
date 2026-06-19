
// controllers/checkoutController.js
//
// Yeh file "checkout" action ki logic rakhti hai.
// Yeh tumhare contract v0.2 ke Supported Actions list mein hai,
// aur original problem statement PDF mein bhi "Cart/Checkout Control"
// feature mention kiya gaya tha.

const cart = require("../data/cart");

// Yeh function chalega jab: POST /checkout call hoga
// Expected request body: { "action": "checkout" }
const checkout = (req, res) => {

  const { action } = req.body;

  // STEP 1: action field check karo
  if (!action) {
    return res.status(400).json({
      success: false,
      message: "action field is required"
    });
  }

  if (action !== "checkout") {
    return res.status(400).json({
      success: false,
      message: `This endpoint only supports action "checkout", received "${action}"`
    });
  }

  // STEP 2: Agar cart khali hai, checkout allow nahi karo.
  // Yeh ek real-world edge case hai jo demo ke time aa sakta hai.
  if (cart.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty, nothing to checkout"
    });
  }

  // STEP 3: Total price calculate karo
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // STEP 4: Order ka summary banao.
  // Real app mein yeh database mein save hota hai with unique order ID.
  // Abhi ke liye mock checkout hai -- order confirm karo aur cart khali karo.
  const orderSummary = {
    orderId: "ORD" + Date.now(),
    // Date.now() current time deta hai milliseconds mein -- isse
    // har order ko ek alag-alag jaisa ID mil jaata hai, database
    // ke bina bhi.
    items: [...cart],
    // [...cart] cart ka EK COPY banata hai. Copy banana zaroori hai
    // kyunki hum agle step mein asli cart ko khali karne wale hain,
    // lekin response mein yeh dikhana hai ki kya order hua tha.
    total: total
  };

  // STEP 5: Checkout ke baad cart khali kar do (order successfully place ho gaya)
  cart.length = 0;
  // "cart = []" nahi likha, kyunki wo ek NAYA array banata hai aur
  // sirf is file ke andar wala reference badalta hai. data/cart.js ka
  // asli array waisa hi reh jaata. "cart.length = 0" existing array ko
  // hi andar se khali karta hai, isliye sab jagah cart khali dikhega.

  res.json({
    success: true,
    message: "Order placed successfully",
    order: orderSummary
  });
};

module.exports = { checkout };
