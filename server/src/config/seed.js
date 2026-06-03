// Seed.js = Use to seed initial data into MongoDB at the start of project / reset database
// Responsibility: connect DB, insert data, then exit (close connection)

// - Run with: cd server (terminal) >> node src/config/seed.js
// - Make sure MongoDB is running and MONGO_URI in .env is correct

const mongoose = require("mongoose"); // Connect to MongoDB and define schemas/models
const dotenv = require("dotenv"); // to read .env variables (MONGO_URI)
const bcrypt = require("bcryptjs"); // to hash password before storing in DB
const Product = require("../models/productModel"); // Mongoose model for products collection
const User = require("../models/userModel"); // Mongoose model for users collection
const products = require("../../db.json").products; // Sample product data from db.json (array of product objects)

// - load .env variables (like MONGO_URI) from the server/.env file, to get MONGO_URI for connecting to MongoDB
// dotenv.config({ path: "../../.env" });

const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

mongoose
  .connect(process.env.MONGO_URI) // Connect to MongoDB using MONGO_URI from .env
  .then(async () => {
    // ── Seed Products ──────────────────────────────────────────
    await Product.deleteMany(); // Clear old existing products
    await Product.insertMany(products); // Insert sample products from db.json into MongoDB using the Product model
    console.log("✅ Products seeded!");

    // ── Seed Default User ──────────────────────────────────────
    // - Find User (email: "user@samrub.com") in MongoBB >> if not exists → create with hashed password "password" >> log success message
    // Default login: email "user@samrub.com" / password "password"
    const exists = await User.findOne({ email: "user@samrub.com" });
    if (!exists) {
      const hashed = await bcrypt.hash("password", 10); // hash password before storing, 10 = salt rounds (complexity)
      await User.create({
        username: "user",
        email: "user@samrub.com",
        password: hashed, // password from hashed + salt, not plain text
      });
      console.log(
        "✅ Default user seeded! email: user@samrub.com / password: password",
      );
    } else {
      console.log("ℹ️  Default user already exists, skipping.");
    }

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
