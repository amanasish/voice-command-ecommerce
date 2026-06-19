
// controllers/cartController.js
//
// Yeh file cart ki LOGIC rakhti hai -- addToCart aur removeFromCart.
// Pattern bilkul wahi hai jo productController.js mein use kiya tha.

const cart = require("../data/cart");
const products = require("../data/products");
// products import kiya hai taaki jab koi item add ho, uska poora detail
// (title, price) bhi cart mein save kar saken, sirf ID nahi.


// ============================================================
// FUNCTION 1: addToCart
// ============================================================
// Yeh function chalega jab: POST /cart/add call hoga
// Expected request body (contract v0.2 ke according):
//   {
//     "action": "addToCart",
//     "productId": "p101",
//     "quantity": 1
//   }
const addToCart = (req, res) => {

  // STEP 1: Request body se data nikalo
  const { action, productId, quantity } = req.body;

  // STEP 2: "action" field check karo -- yeh REQUIRED hai contract ke
  // Common Fields table mein. Agar missing hai, error bhejo.
  if (!action) {
    return res.status(400).json({
      success: false,
      message: "action field is required"
    });
  }

  // STEP 3: "action" sahi value hai ya nahi check karo.
  // Yeh endpoint sirf "addToCart" action accept karega.
  if (action !== "addToCart") {
    return res.status(400).json({
      success: false,
      message: `This endpoint only supports action "addToCart", received "${action}"`
    });
  }

  // STEP 4: productId check karo -- iske bina pata nahi chalega
  // kaunsa product add karna hai.
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "productId is required"
    });
  }

  // STEP 5: products list mein dhundo ki yeh productId exist karta hai ya nahi
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // STEP 6: Check karo ki yeh product PEHLE SE cart mein hai ya nahi.
  // Agar hai, to sirf quantity badha do. Agar nahi hai, to naya item add karo.
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    // quantity || 1 ka matlab: agar quantity nahi bheja gaya, to 1 maan lo
    existingItem.quantity += quantity || 1;
  } else {
    cart.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity || 1
    });
  }

  // STEP 7: Poora updated cart wapis bhejo, taaki frontend ko har baar
  // alag se "get cart" call na karna pade.
  res.json({
    success: true,
    cart: cart
  });
};


// ============================================================
// FUNCTION 2: removeFromCart
// ============================================================
// Yeh function chalega jab: POST /cart/remove call hoga
// Expected request body:
//   {
//     "action": "removeFromCart",
//     "productId": "p101"
//   }
const removeFromCart = (req, res) => {

  const { action, productId } = req.body;

  // Same validation pattern jo addToCart mein tha
  if (!action) {
    return res.status(400).json({
      success: false,
      message: "action field is required"
    });
  }

  if (action !== "removeFromCart") {
    return res.status(400).json({
      success: false,
      message: `This endpoint only supports action "removeFromCart", received "${action}"`
    });
  }

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "productId is required"
    });
  }

  // STEP 1: Cart mein dhundo ki yeh item kahan hai (kaunsa index)
  const itemIndex = cart.findIndex((item) => item.productId === productId);

  // findIndex -1 return karta hai agar item nahi mila
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Item not in cart"
    });
  }

  // STEP 2: Us index se item hata do
  // splice(index, kitne hatane hain) -- yeh built-in array method hai
  cart.splice(itemIndex, 1);

  res.json({
    success: true,
    cart: cart
  });
};


// ============================================================
// FUNCTION 3: getCart (cart dekhne ke liye, bonus helper)
// ============================================================
const getCart = (req, res) => {
  // Total price calculate karo, taaki frontend ko alag se calculation
  // na karni pade
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    success: true,
    cart: cart,
    total: total
  });
};

// Teen functions export karo taaki routes file use kar sake
module.exports = { addToCart, removeFromCart, getCart };