// dbConnection: Use when starting server to connect to MongoDB database using Mongoose(npm run dev)
// use every time we start the server, to connect to MongoDB before handling any requests
// Responsibility: Connect to MongoDB using MONGO_URI  >> Routers/Controllers can then use Mongoose models to interact with the database
// dotenv: no need to load .env variables here because we already load them in server.js before calling connectDB() — MONGO_URI is available in process.env when connectDB runs

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB error: ${err.message}`);
    // process.exit(1); // commented out so server keeps running during dev
  }
};

module.exports = connectDB;
