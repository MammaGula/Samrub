// validationToken.js: Middleware for validating JWT tokens in Express routes
// - If exists Token in Request header
// - If token is correct
// - If token is expired or invalid
// If valid → pass to next route, if not valid → send 401 Unauthorized

// - Automatic error handling for async functions in Express routes
// - Dont need try-catch in every route, just throw error and it will be caught by errorHandler middleware
const asyncHandler = require("express-async-handler");
const { constants } = require("../../constants");

// Middleware function to validate JWT token
const jwt = require("jsonwebtoken");

// 1. Check Authorization header
// - If no header("authorization") or not Bearer token → 401
const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("No token provided");
  }
  // Get token from header and verify it [Bearer[0], "TOKEN"[1]]
  const token = authHeader.split(" ")[1];
  try {
    // 2. Check token validity and expiration, if valid
    // → decode token and attach user info to req.user, then call next() to pass to next middleware/route
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Token invalid or expired");
  }
});

module.exports = validateToken;

// Get Token from Authorization header: Bearer {token} header
// Verify token with JWT_SECRET
// If valid: set req.user and call next()
// If invalid: send 401 error and stop chain
// next() is critical: If we dont call next(), request is stopped and never reaches controller!
