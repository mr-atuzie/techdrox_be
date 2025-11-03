const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  completeOnboarding,
  getStudentProfile,
  chooseFundingOption,
} = require("../controllers/user");

// @route   POST /api/v1/users/register
router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

// @route   POST /api/v1/users/login
router.post("/login", loginUser);

// @route   GET /api/v1/users/logout
router.get("/logout", logoutUser);

router.post("/onboarding", completeOnboarding);

router.get("/profile", getStudentProfile);

router.post("/funding-option", chooseFundingOption);

module.exports = router;
