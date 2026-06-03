// productRoutes.js: Define routes for products, import controller functions from productController.js
// 
// - Dont need validationToken middleware because product routes are public (no auth required) >> Everyone can see products without logging in
const router = require("express").Router();
// Import controller functions for products from productController.js
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
