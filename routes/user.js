const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/user");

// @route   POST /api/v1/users/register
router.post("/register", registerUser);

// @route   POST /api/v1/users/login
router.post("/login", loginUser);

// @route   GET /api/v1/users/logout
router.get("/logout", logoutUser);

module.exports = router;
