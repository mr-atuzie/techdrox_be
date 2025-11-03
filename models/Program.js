const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  //   instructor: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  category: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "UI/UX Design",
      "React JS",
      "JavaScript",
      "Python",
      "Mobile Development",
    ],
  },
  thumbnail: String,
  price: {
    type: Number,
    required: true,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  duration: Number, // in hours
  language: {
    type: String,
    default: "English",
  },
  learningObjectives: [String],
  prerequisites: [String],
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Program = mongoose.model("Program", programSchema);
module.exports = Program;
