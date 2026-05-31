// userRoutes.js - Express router for user-related endpoints (register, login, currentUser info.)

const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");

const validateToken = require("../middleware/validationToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// Future plan: Add route for updating user profile, changing password, etc.
router.get("/current", validateToken, currentUser);

module.exports = router;
