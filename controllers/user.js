// const User = require("../models/User");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // Register a new user
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, phone } = req.body;

//   if (!name || !email || !password || !phone) {
//     res.status(400);
//     throw new Error("Please enter all required fields");
//   }

//   // Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     res.status(400);
//     throw new Error("Email already exists");
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Create new user
//   const newUser = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     phone,
//   });

//   if (!newUser) {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }

//   // Generate JWT token (expires in 7 days)
//   const token = generateToken(newUser._id);

//   // Set cookie to expire in 7 days
//   res.cookie("token", token, {
//     path: "/",
//     httpOnly: true,
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//     sameSite: "none",
//     secure: true,
//   });

//   res.status(201).json({
//     success: true,
//     msg: "User registered successfully",
//     user: {
//       _id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       phone: newUser.phone,
//     },
//     token,
//   });
// });

// // Login user
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     res.status(400);
//     throw new Error("Please provide email and password");
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     res.status(401);
//     throw new Error("Invalid credentials");
//   }

//   const token = generateToken(user._id);

//   // Set cookie (7 days)
//   res.cookie("token", token, {
//     path: "/",
//     httpOnly: true,
//     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     sameSite: "none",
//     secure: true,
//   });

//   res.status(200).json({
//     success: true,
//     msg: "Login successful",
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//     },
//     token,
//   });
// });

// // Logout User
// const logoutUser = asyncHandler(async (req, res) => {
//   res.cookie("token", "", {
//     path: "/",
//     httpOnly: true,
//     expires: new Date(0),
//     sameSite: "none",
//     secure: true,
//   });

//   res.status(200).json({ success: true, msg: "Logged out successfully" });
// });

// controllers/authController.js
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, country } = req.body;

  if (!name || !email || !password || !country) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  // Generate email verification token
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    country,
    emailVerificationToken,
    emailVerificationExpires,
  });

  if (!newUser) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // Send verification email
  // const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

  // try {
  //   await sendEmail({
  //     email: newUser.email,
  //     subject: "Verify Your Email Address",
  //     template: "emailVerification",
  //     data: {
  //       name: newUser.name,
  //       verificationUrl,
  //     },
  //   });
  // } catch (error) {
  //   console.log("Email sending failed:", error);
  //   // Continue even if email fails
  // }

  // Generate JWT token
  const token = generateToken(newUser._id);

  // Set cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    message:
      "User registered successfully. Please check your email for verification.",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      country: newUser.country,
      isEmailVerified: newUser.isEmailVerified,
    },
    token,
  });
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).populate("studentProfile");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  // Set cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      isEmailVerified: user.isEmailVerified,
      hasCompletedOnboarding: !!user.studentProfile,
      studentProfile: user.studentProfile,
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

// Complete onboarding questionnaire
const completeOnboarding = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    laptopOwnership,
    canSelfFund,
    preferredProgram,
    needsFunding,
    canCommitDaily,
    expectedTimeline,
  } = req.body;

  // Validate required fields
  if (
    typeof laptopOwnership !== "boolean" ||
    typeof canSelfFund !== "boolean" ||
    !preferredProgram ||
    typeof needsFunding !== "boolean" ||
    typeof canCommitDaily !== "boolean" ||
    ![2, 3, 6].includes(expectedTimeline)
  ) {
    res.status(400);
    throw new Error("Please provide all required onboarding information");
  }

  // Check if user already has a profile
  const existingProfile = await StudentProfile.findOne({ user: userId });
  if (existingProfile) {
    res.status(400);
    throw new Error("Onboarding already completed");
  }

  // Determine funding status based on conditions
  let fundingStatus;
  let adminReviewStatus = "pending";

  if (laptopOwnership && canSelfFund) {
    fundingStatus = "direct_payment";
    adminReviewStatus = "approved";
  } else if (needsFunding) {
    fundingStatus = "loan";
    adminReviewStatus = "pending"; // Needs admin review for loan
  } else {
    fundingStatus = "fundraising";
    adminReviewStatus = "pending"; // Needs admin review for fundraising
  }

  // Create student profile
  const studentProfile = await StudentProfile.create({
    user: userId,
    laptopOwnership,
    canSelfFund,
    preferredProgram,
    needsFunding,
    canCommitDaily,
    expectedTimeline,
    fundingStatus,
    adminReviewStatus,
  });

  // Update user with student profile reference
  await User.findByIdAndUpdate(userId, { studentProfile: studentProfile._id });

  // Populate the preferred program details
  await studentProfile.populate(
    "preferredProgram",
    "title category price duration"
  );

  res.status(201).json({
    success: true,
    message: "Onboarding completed successfully",
    data: {
      studentProfile,
      nextStep: determineNextStep(fundingStatus, adminReviewStatus),
    },
  });
});

// Helper function to determine next step
const determineNextStep = (fundingStatus, adminReviewStatus) => {
  if (fundingStatus === "direct_payment" && adminReviewStatus === "approved") {
    return {
      action: "redirect",
      route: "/payment",
      message: "Proceed to payment and enrollment",
    };
  } else if (fundingStatus === "loan" || fundingStatus === "fundraising") {
    return {
      action: "redirect",
      route: "/funding-options",
      message: "Choose funding option",
    };
  } else {
    return {
      action: "wait",
      route: "/pending-review",
      message: "Your application is under review",
    };
  }
};

// Get student profile
const getStudentProfile = asyncHandler(async (req, res) => {
  const studentProfile = await StudentProfile.findOne({ user: req.user._id })
    .populate("preferredProgram", "title category price duration level")
    .populate("reviewedBy", "name email");

  if (!studentProfile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  res.status(200).json({
    success: true,
    data: studentProfile,
  });
});

// Choose funding option (for students who need funding)
const chooseFundingOption = asyncHandler(async (req, res) => {
  const { fundingOption } = req.body; // 'fundraising' or 'loan'

  if (!["fundraising", "loan"].includes(fundingOption)) {
    res.status(400);
    throw new Error("Invalid funding option");
  }

  const studentProfile = await StudentProfile.findOne({ user: req.user._id });

  if (!studentProfile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  if (studentProfile.fundingStatus !== "pending_review") {
    res.status(400);
    throw new Error("Funding option already chosen");
  }

  studentProfile.fundingStatus = fundingOption;
  studentProfile.adminReviewStatus = "pending";
  await studentProfile.save();

  res.status(200).json({
    success: true,
    message: `Funding option set to ${fundingOption}. Waiting for admin approval.`,
    data: studentProfile,
  });
});

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  completeOnboarding,
  getStudentProfile,
  chooseFundingOption,
};
