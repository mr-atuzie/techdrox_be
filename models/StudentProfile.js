// models/StudentProfile.js
const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  // Onboarding Questions
  laptopOwnership: {
    type: Boolean,
    required: true,
  },
  canSelfFund: {
    type: Boolean,
    required: true,
  },
  preferredProgram: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  needsFunding: {
    type: Boolean,
    required: true,
  },
  canCommitDaily: {
    type: Boolean,
    required: true,
  },
  expectedTimeline: {
    type: Number,
    enum: [2, 3, 6],
    required: true,
  },

  // Funding Status
  fundingStatus: {
    type: String,
    enum: ["direct_payment", "fundraising", "loan", "pending_review"],
    default: "pending_review",
  },

  // Admin Review
  adminReviewStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewedAt: Date,

  // Enrollment Status
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  enrolledAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

studentProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
module.exports = StudentProfile;
