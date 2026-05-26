// errorHandler.js: Middleware for handling errors in Express routes

const errorHandler = (err, req, res, next) => {
  // If status code is already set (e.g. 400, 404, 401) use that, otherwise default to 500 (Internal Server Error)
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message, // Send error message back to client
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Show stack trace only in development
  });
};

module.exports = errorHandler;
