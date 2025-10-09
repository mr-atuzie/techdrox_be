const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  if (!newUser) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // Generate JWT token (expires in 7 days)
  const token = generateToken(newUser._id);

  // Set cookie to expire in 7 days
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    msg: "User registered successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    },
    token,
  });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  // Set cookie (7 days)
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    msg: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
  });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ success: true, msg: "Logged out successfully" });
});

module.exports = { registerUser, loginUser, logoutUser };
