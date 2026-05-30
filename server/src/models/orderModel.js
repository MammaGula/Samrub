const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model (null if guest)
      ref: "User",
      required: false, // guest can order without login
      default: null,
    },
    items: [
      {
        // Reference to Product model, but we also store name and price at time of order for history
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    delivery: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    payment: {
      method: { type: String, enum: ["card", "swish"] },
      cardNumber: String,   // only set when method === "card"
      expiry: String,
      cvv: String,
      swishNumber: String,  // only set when method === "swish"
    },
    totalAmount: Number,
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }, // createdAt, updatedAt automatic
);

module.exports = mongoose.model("Order", orderSchema);
