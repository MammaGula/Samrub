// ordersController: place order, get my orders

const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel"); // Mongoose model for orders (userId, items, delivery, payment, totalAmount, createdAt) - defined in orderModel.js

// ==================================================
// 1. POST /api/orders: Place a new order
// ==================================================
//@desc post a new order
//@route POST /api/orders
//@access public

const placeOrder = asyncHandler(async (req, res) => {
  // Read order data from req.body (items, delivery, payment, totalAmount)
  // → validate (all fields exist?) → create new order in MongoDB  → return created order as JSON response to frontend
  const { items, delivery, payment, totalAmount } = req.body;
  if (!items || !delivery || !payment) {
    res.status(400);
    throw new Error("Missing order data");
  }
  const order = await Order.create({
    userId: req.user?.id || null, // if user is logged in, use their id, otherwise set to null for guest orders
    items,
    delivery,
    payment,
    totalAmount,
  });
  res.status(201).json(order);
});

// ==================================================
// 2. GET /api/orders/my: See my order history (protected route - only logged in users can access their own orders)
// ==================================================
//@desc get current user's orders
//@route GET /api/orders/my
//@access private

const getMyOrders = asyncHandler(async (req, res) => {
  // Find  orders in MongoDb for the logged in user (userId from req.user.id) → sort by createdAt descending (newest first) → return orders as JSON response to frontend
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1, // Sort by createdAt descending (newest first)
  });
  res.json(orders);
});

module.exports = { placeOrder, getMyOrders };
