const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  toggleReaction,
  addComment,
  getPostComments,
} = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); // Your auth middleware

// Create a post (with authentication)
router.post("/", authMiddleware, createPost);

// Get all posts
router.get("/", getAllPosts);

// Get a post by ID
router.get("/:id", getPostById);

// Edit a post (with authentication, only the post owner can edit)
router.put("/:id", authMiddleware, upload.single("image"), editPost);

// Delete a post (with authentication, only the post owner can delete)
router.delete("/:id", authMiddleware, deletePost);

router.put("/:id/like", authMiddleware, toggleReaction);

// comments
router.post("/:postId/comments", authMiddleware, addComment);
router.get("/:postId/comments", getPostComments);

module.exports = router;
