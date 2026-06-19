
// routes/checkoutRoutes.js

const express = require("express");
const router = express.Router();

const { checkout } = require("../controllers/checkoutController");

// POST /  -> /checkout banega jab server.js mein mount karenge
router.post("/", checkout);

module.exports = router;
