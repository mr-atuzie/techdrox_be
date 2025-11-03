const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  duration: Number, // in minutes
  isFree: {
    type: Boolean,
    default: false,
  },
  resources: [
    {
      title: String,
      url: String,
      type: String, // 'pdf', 'zip', 'external-link', etc.
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
