// favoriteController.js - handles adding/removing products to/from favorites and viewing favorite products
// Requires authentication (user must be logged in to manage favorites)

const asyncHandler = require("express-async-handler");
const Favorite = require("../models/favoriteModel"); // Mongoose model for favorites (userId, productId) - defined in favoriteModel.js

// ==================================================
// 1. GET /api/favorites
// ==================================================

//@desc get all favorite products for the logged in user
//@route GET /api/favorites
//@access private

const getFavorites = asyncHandler(async (req, res) => {
  // Find all favorites in MongoDB for the logged in user (userId from req.user.id)
  // → populate product details(all details) from Product model → return favorites as JSON response to frontend
  const favs = await Favorite.find({ userId: req.user.id }).populate(
    "productId",
  );
  res.json(favs); // return to frontend
});

// ==================================================
// 2. POST /api/favorites
// ==================================================

//@desc add a new favorite
//@route POST /api/favorites
//@access private

const addFavorite = asyncHandler(async (req, res) => {
  // Read productId from req.body
  // → create new favorite in MongoDB with userId from req.user.id and productId from req.body
  const { productId } = req.body;
  const fav = await Favorite.create({ userId: req.user.id, productId });
  res.status(201).json(fav);
});

// ==================================================
// 3. DELETE /api/favorites/:productId
// ==================================================

//@desc remove a favorite
//@route DELETE /api/favorites/:productId
//@access private

const removeFavorite = asyncHandler(async (req, res) => {
  
  // Read productId from req.params
  // → find and delete favorite in MongoDB with (userId from req.user.id) and (productId from req.params)
  await Favorite.findOneAndDelete({
    userId: req.user.id,
    productId: req.params.productId,
  });
  res.json({ message: "Removed from favorites" });
});

module.exports = { getFavorites, addFavorite, removeFavorite };
