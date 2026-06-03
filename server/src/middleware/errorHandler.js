// - errorHandler.js: Middleware for handling errors in Express routes, Controllers
// - Uses constants.js for status codes instead of hardcoded numbers

// - what should be response with this error? status code, message, stack trace (only in development)
// - Send response with correct status code(400, 401, 403, 404, 500)+ json error objectback to frontend.

const { constants } = require("../../constants");

const errorHandler = (err, req, res, next) => {
  // If status code is already set (e.g. 400, 404, 401) use that, otherwise default to 500 (server error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    // If error is a validation error (e.g. missing required field, invalid data type)
    // → 400 Bad Request >> Send response with title "Validation Failed" and error message from err.message
    case constants.VALIDATION_ERROR:
      res.status(statusCode).json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack, // Show stack trace only in development
      });
      break;

    // 404
    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not Found",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    // 401
    case constants.UNAUTHORIZED:
      res.status(statusCode).json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    // 403
    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    // 500
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: process.env.NODE_ENV === "production" ? null : err.stack,
      });
      break;

    // If error is not one of the above, default to 500 Server Error
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
