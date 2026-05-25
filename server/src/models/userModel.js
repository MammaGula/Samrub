// required: [true, "message"] = validering
// timestamps: true = auto-created och updated fields

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true, // Inte två users samma username
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Inte två users samma email
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatic
  },
);

module.exports = mongoose.model("User", userSchema);
