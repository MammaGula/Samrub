// favoriteRoutes.js: Define routes for managing user favorites (GET /api/favorites, POST /api/favorites, DELETE /api/favorites/:productId)
// All routes require authentication (user must be logged in to manage favorites)

const router = require("express").Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const validateToken = require("../middleware/validationToken");

router.use(validateToken);
router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:productId", removeFavorite);

module.exports = router;
