// models/Product.js
//
// Contract v0.7 requires BOTH fields on every product:
//   - "_id"  -> MongoDB's internal auto-generated ID
//   - "id"   -> Public product ID (e.g. "p101")
// Also supports occasion-based filtering.

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  // Added for API Contract v0.7
  occasion: {
    type: [String],
    default: []
    // Example:
    // ["diwali", "party"]
  },

  color: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  imageUrl: {
    type: String
  },

  stock: {
    type: Number,
    required: true,
    default: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);