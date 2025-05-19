const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Ensure title is required
      minlength: 3, // Optional: ensure the title has a minimum length
    },
    body: {
      type: String,
      required: true, // Ensure body is required
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to User model
    },
    imageUrl: {
      type: String,
      default: "", // Optional: provide a default empty string for imageUrl
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"],
          required: false, // Changed to false to allow removal
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
