const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { constants } = require("../../constants");

// ==================================================
// 1. POST /api/users/register
// ==================================================
//@desc register a user
//@route POST /api/users/register
//@access public

// Get data from Frontend (req.body) → validate it(exists all 3 fields?), if not
// → check if email already exists → if not, hash password → create user and hash password in DB
// → return user info (id, username, email) to frontend (not password!)
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are required");
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Email already in use");
  }

  // Hash Password: bcrypt.hash(password, saltRounds) → returns hashed password
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res
    .status(201)
    .json({ id: user._id, username: user.username, email: user.email });
});

// ==================================================
// 2. POST /api/users/login
// ==================================================
//@desc login a user
//@route POST /api/users/login
//@access public


// Get email + password from frontend → validate (all fields filled?)
// → find user by email → if user exists, compare password with bcrypt.compare → if valid, create JWT token with user info and return to frontend
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are required");
  }

  //- if no user with that email or password is incorrect → 401 error
  // - or if password is incorrect → 401 error
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Invalid credentials");
  }

  // If exists mail and password is correct >> Sign In and token is valid 7 days
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // - send back JSON to frontend >> accessToken and user info (id, username, email) (not password!)
  res.json({
    accessToken,
    user: { id: user._id, username: user.username, email: user.email },
  });
});

// ==================================================
// 3. GET /api/users/current  (protected)
// Future plan: Add route for updating user profile, changing password, etc.
// ==================================================
//@desc get current user
//@route GET /api/users/current
//@access private

// Verify JWT token from Authorization header → if valid, return user info (id, username, email) to frontend
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
