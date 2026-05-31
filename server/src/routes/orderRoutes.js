// orders route: api/orders
// Handles order-related routes (e.g. POST /api/orders to place order, GET /api/orders/my to see my orders)

const router = require("express").Router();
const { placeOrder, getMyOrders } = require("../controllers/orderController");
const validateToken = require("../middleware/validationToken");

router.post("/", placeOrder);           // public — guest can order without login

// Future plan: Add route for canceling orders, etc.
router.get("/my", validateToken, getMyOrders); 


module.exports = router;
