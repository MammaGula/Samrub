// Server.js: EXPRESS Setup(middleware) >> Work As Setting in ASP.NET
// - Express: Framework för att bygga webb server (Routes)

const express = require("express");
const cors = require("cors"); // Middleware för att hantera CORS (Cross-Origin Resource Sharing)

// Use {} when we want to export many values from mongoose, ex. connect, disconnect, etc.
// const { connect } = require("mongoose");

const dotenv = require("dotenv");
const connectDB = require("./src/config/dbConnection"); // Funktion för att ansluta till MongoDB
// const errorHandler = require("./src/middleware/errorHandler"); // TODO: create this file

dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to MongoDB

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware för att parsa JSON i request body

// Routes
// app.use("/api/users", require("./src/routes/userRoutes")); // TODO: create this file
// app.use("/api/products", require("./src/routes/productRoutes")); // TODO: create this file
// app.use("/api/orders", require("./src/routes/orderRoutes")); // TODO: create this file
// app.use("/api/favorites", require("./src/routes/favoriteRoutes")); // TODO: create this file

// Error handler (must be after routes to catch errors from them)
// app.use(errorHandler); // TODO: create errorHandler first

// fall back till 4000 om PORT inte är satt i .env
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Client Request
//      ↓
// server.js (global middleware)
//      ↓
// Route file (route-level middleware)
//      ↓
// Controller (your logic)
//      ↓
// Response
