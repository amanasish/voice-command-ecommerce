// models/Product.js
//
// Contract v0.6 requires BOTH fields on every product:
//   - "_id"  -> MongoDB's internal auto-generated ID (stays internal)
//   - "id"   -> a public, custom field (e.g. "p101") used in API responses

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
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("Product", productSchema);