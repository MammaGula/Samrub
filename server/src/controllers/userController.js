const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route POST /api/users/register
//@access public

// 1. POST /api/users/register
// Get data from Frontend (req.body) → validate it(exists all 3 fields?), if not
// → check if email already exists → if not, hash password → create user and hash password in DB
// → return user info (id, username, email) to frontend (not password!)
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  // Hash Password: bcrypt.hash(password, saltRounds) → returns hashed password
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res
    .status(201)
    .json({ id: user._id, username: user.username, email: user.email });
});

//@desc login a user
//@route POST /api/users/login
//@access public

// 2. POST /api/users/login
// Get email + password from frontend → validate (all fields filled?) 
// → find user by email → if user exists, compare password with bcrypt.compare → if valid, create JWT token with user info and return to frontend
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({ token, username: user.username });
});



// GET /api/users/current  (protected)
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
