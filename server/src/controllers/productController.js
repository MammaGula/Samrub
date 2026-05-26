// productController.js: Handles product-related routes (e.g. GET /api/products, GET /api/products/:id)

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// ==================================================
// 1. GET /api/products  (optional ?category=Starter)
// ==================================================

//@desc get all products
//@route GET /api/products
//@access public

const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query; // Read query from URL
  const filter = category ? { category } : {}; // If category exists, filter by category, else no filter (all products)
  // Find products with filter from MongoDB
  // (if category specified, only return products in that category, otherwise return all)
  const products = await Product.find(filter);
  res.json(products); // Send products as JSON response to frontend
});

// User clicks "Starter"
//       ↓
// React sends axios.get("/api/products?category=Starter")
//       ↓
// Express receives req.query = { category: "Starter" }
//       ↓
// MongoDB find({ category: "Starter" })
//       ↓
// send products back to frontend

// =========================
// 2. GET /api/products/:id
// =========================
//@desc get a product by ID
//@route GET /api/products/:id
//@access public

const getProductById = asyncHandler(async (req, res) => {
  // Read id from request params >> and find product by id in MongoDB with Product.findById(id)
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product); // Send product as JSON response to frontend
});

module.exports = { getProducts, getProductById };
