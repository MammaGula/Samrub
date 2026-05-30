// productController.js: Handles product-related routes (e.g. GET /api/products, GET /api/products/:id)

const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { constants } = require("../../constants");

// ==================================================
// 1. GET /api/products
// ==================================================

//@desc get all products
//@route GET /api/products
//@access public


const getProducts = asyncHandler(async (req, res) => {
  // Currently filtering by category is done in the frontend (FoodDisplay.jsx).
  // This is fine for a small dataset — all products are fetched once and filtered in the browser.

  // --- Backend filter (available if dataset grows large) ---
  // Uncomment below and remove Product.find({}) to switch to backend filtering:
  // const { category } = req.query;
  // const filter = category ? { category } : {};
  // const products = await Product.find(filter);
  // ---------------------------------------------------------

  const products = await Product.find({}); // Fetch all products from MongoDB without filtering (filtering is done in frontend)
  res.json(products);
});

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
    res.status(constants.NOT_FOUND);
    throw new Error("Product not found");
  }
  res.json(product); // Send product as JSON response to frontend
});

module.exports = { getProducts, getProductById };
