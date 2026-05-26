// Seed.js = Script to seed initial product data into MongoDB using Mongoose,
// use with start running a new project / reset database during development
// when: Running for the first time, or if you want to reset the database to initial state during development (e.g. after making changes to product schema, or just to clear out test orders/favorites)
// Reponsibility: Connect to MongoDB  / Insert data / close connection
// - dotenv: No server.js doesn't call this file, so we need to load .env variables here to get MONGO_URI for connecting to MongoDB


// - Run with: cd server (terminal) >> node src/config/seed.js
// - Make sure MongoDB is running and MONGO_URI in .env is correct

const mongoose = require("mongoose"); // Connect to MongoDB and define schemas/models
const dotenv = require("dotenv"); // to read .env variables (like MONGO_URI)
const Product = require("../models/productModel"); // Mongoose model for products collection
const products = require("../../db.json").products; // Sample product data from db.json (array of product objects)

// - load .env variables (like MONGO_URI) from the server/.env file, to get MONGO_URI for connecting to MongoDB
// dotenv.config({ path: "../../.env" });

const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// __dirname = server/src/config → ../../.env = server/.env ✅

mongoose
  .connect(process.env.MONGO_URI) // Connect to MongoDB using MONGO_URI from .env
  .then(async () => {
    await Product.deleteMany(); // Clear old existing products (not duplicate on every seed)
    await Product.insertMany(products); // Insert sample products from db.json into MongoDB using the Product model
    console.log("✅ Products seeded!");
    process.exit(); // Exit the script after seeding is done, because Mongoose connection is still open otherwise
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });

//   Run seed.js
//   ↓
//   Load .env variables (like MONGO_URI) from server/.env
//     ↓
//     Connect to MongoDB using MONGO_URI
//         ↓
//         If connection successful:
//             Clear old existing products from MongoDB (avoid duplicates)
//             Insert sample products from db.json into MongoDB using Product model
//             Log success message
//             Exit script (close Mongoose connection)
//         If connection fails:
//             Log error message
//             Exit script with error code
