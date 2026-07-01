// models/User.js
//
// User Model
// Authentication uses plain text password (No bcrypt as per project requirement)

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      // Plain text password
      // No bcrypt as per leader's instruction
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);