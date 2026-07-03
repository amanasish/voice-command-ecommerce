// seed.js
//
// Yeh script data/products.js ka data MongoDB mein insert karta hai.
// Chalane ka tarika: node seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const hardcodedProducts = require("./data/products");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    console.log("Old products cleared");

    await Product.insertMany(hardcodedProducts);
    console.log(`${hardcodedProducts.length} products inserted successfully`);

    await mongoose.connection.close();
    console.log("Seeding complete. Connection closed.");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();