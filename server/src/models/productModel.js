const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }, // createdAt, updatedAt automatic
);

module.exports = mongoose.model("Product", productSchema);
