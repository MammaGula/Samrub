const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true, // Must have a userId
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Product model
      ref: "Product",
      required: true, // Must have a productId
    },
  },
  { timestamps: true }, // createdAt, updatedAt automatic
);

// ----Config options for the schema:-----
// Protect duplicate entries(Create Compound Index) , 1 = ascending order, unique: true = no duplicates allowed for this combination of userId and productId
// - Same user can not choose the same product as favorite more than once.
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Create model "Favorite" based on favoriteSchema, and export it for use in other parts of the application (e.g. controllers)
module.exports = mongoose.model("Favorite", favoriteSchema);
