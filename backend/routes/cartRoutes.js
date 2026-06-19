
// routes/cartRoutes.js
//
// Yeh file sirf decide karti hai: kaunsa URL kaunsa function chalayega.
// Logic yahan nahi hai -- wo controller mein hai.

const express = require("express");
const router = express.Router();

const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");

// POST /cart/add  -> addToCart function chalega
router.post("/add", addToCart);

// POST /cart/remove  -> removeFromCart function chalega
router.post("/remove", removeFromCart);

// GET /cart  -> getCart function chalega (cart dekhne ke liye)
router.get("/", getCart);

module.exports = router;