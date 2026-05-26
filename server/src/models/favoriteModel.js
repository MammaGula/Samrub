const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Product model
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }, // createdAt, updatedAt automatic
);

// Protect duplicate entries(Create Compound Index) , 1 = ascending order, unique: true = no duplicates allowed for this combination of userId and productId
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
