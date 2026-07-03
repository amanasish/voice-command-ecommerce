// data/products.js
//
// Temporary in-memory product data.
// Updated for API Contract v0.7 with occasion support.

const products = [
  {
    id: "p101",
    title: "Blue Cotton Shirt",
    category: "shirts",
    occasion: ["casual", "party"],
    color: "blue",
    price: 899,
    imageUrl: "/images/p101.jpg",
    stock: 20
  },
  {
    id: "p102",
    title: "Red Denim Jeans",
    category: "jeans",
    occasion: ["casual"],
    color: "red",
    price: 1299,
    imageUrl: "/images/p102.jpg",
    stock: 15
  },
  {
    id: "p103",
    title: "Blue Formal Shirt",
    category: "shirts",
    occasion: ["formal", "office"],
    color: "blue",
    price: 750,
    imageUrl: "/images/p103.jpg",
    stock: 25
  },
  {
    id: "p104",
    title: "Black Kurta",
    category: "kurtas",
    occasion: ["diwali", "festive", "wedding"],
    color: "black",
    price: 1100,
    imageUrl: "/images/p104.jpg",
    stock: 10
  },
  {
    id: "p105",
    title: "Blue Kurta",
    category: "kurtas",
    occasion: ["diwali", "party", "festive"],
    color: "blue",
    price: 1200,
    imageUrl: "/images/p105.jpg",
    stock: 8
  },
  {
    id: "p106",
    title: "Green T-Shirt",
    category: "shirts",
    occasion: ["casual"],
    color: "green",
    price: 499,
    imageUrl: "/images/p106.jpg",
    stock: 30
  },
  {
    id: "p107",
    title: "Premium Blue Shirt",
    category: "shirts",
    occasion: ["party", "formal"],
    color: "blue",
    price: 1500,
    imageUrl: "/images/p107.jpg",
    stock: 5
  }
];

module.exports = products;