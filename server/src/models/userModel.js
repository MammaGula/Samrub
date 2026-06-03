// Save userInfo in the database when user registers(username, email, password). We also need to check if email is unique (no duplicate users with same email) and hash the password before saving for security.
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
