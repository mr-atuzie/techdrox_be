const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your full name"],
      minlength: [3, "Full name must be at least 3 characters"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please enter a valid phone number"],
      minlength: [10, "Phone number must be at least 10 digits"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter a valid email address"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a valid password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
