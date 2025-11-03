const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String, // HTML content or text
  videoUrl: String,
  videoDuration: Number, // in seconds
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  lessonType: {
    type: String,
    enum: ["video", "text", "quiz", "assignment"],
    default: "video",
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  attachments: [
    {
      name: String,
      url: String,
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
