// errorHandler.js: Middleware for handling errors in Express routes
// Uses constants.js for status codes instead of hardcoded numbers
// Switch/case gives each error type its own descriptive title

// stackTrace: Tells the path and structure of all the functions that were called leading up to the error.
// > Useful for debugging, but should be hidden in production for security reasons.

const { constants } = require("../../constants");

const errorHandler = (err, req, res, next) => {
  // If status code is already set (e.g. 400, 404, 401) use that, otherwise default to 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.status(statusCode).json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack, // Show stack trace only in development
      });
      break;

    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not Found",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      res.status(statusCode).json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    default:
      res.status(statusCode).json({
        title: "Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;
  }
};

module.exports = errorHandler;



// Controller sets res.status(404)
//       ↓
// throws new Error("Product not found")
//       ↓
// errorHandler catches it
//       ↓
// reads res.statusCode → 404
//       ↓
// switch hits NOT_FOUND case → responds with title "Not Found"