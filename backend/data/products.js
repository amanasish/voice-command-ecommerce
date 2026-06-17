// data/products.js
//
// WHY THIS FILE EXISTS:
// Right now we don't have MongoDB connected yet (that comes later).
// So we keep our product list as a simple JavaScript array, sitting in memory.
// This lets us build and test our API TODAY without waiting for the database.
//
// IMPORTANT: Every field name here matches EXACTLY what is written in
// docs/api-contract.md under "NLP -> Backend" response section:
//   id, title, category, color, price, imageUrl
// We do NOT invent our own names like "productName" or "cost" -- that would
// break the contract and cause integration conflicts with frontend/NLP.

const products = [
  {
    id: "p101",
    title: "Blue Cotton Shirt",
    category: "shirts",
    color: "blue",
    price: 899,
    imageUrl: "/images/p101.jpg"
  },
  {
    id: "p102",
    title: "Red Denim Jeans",
    category: "jeans",
    color: "red",
    price: 1299,
    imageUrl: "/images/p102.jpg"
  },
  {
    id: "p103",
    title: "Blue Formal Shirt",
    category: "shirts",
    color: "blue",
    price: 750,
    imageUrl: "/images/p103.jpg"
  },
  {
    id: "p104",
    title: "Black Kurta",
    category: "kurtas",
    color: "black",
    price: 1100,
    imageUrl: "/images/p104.jpg"
  },
  {
    id: "p105",
    title: "Blue Kurta",
    category: "kurtas",
    color: "blue",
    price: 1200,
    imageUrl: "/images/p105.jpg"
  },
  {
    id: "p106",
    title: "Green T-Shirt",
    category: "shirts",
    color: "green",
    price: 499,
    imageUrl: "/images/p106.jpg"
  },
  {
    id: "p107",
    title: "Premium Blue Shirt",
    category: "shirts",
    color: "blue",
    price: 1500,
    imageUrl: "/images/p107.jpg"
  }
];

// We "export" this array so other files (like our controller) can import
// and use it. Think of "module.exports" as putting this array in a box
// labeled "products.js" that any other file can open using require().
module.exports = products;