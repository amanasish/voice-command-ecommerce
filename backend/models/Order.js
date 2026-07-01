// models/Order.js
//
// MongoDB Order Model
// Stores completed orders.

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "u101", // Demo user
      trim: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "placed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);