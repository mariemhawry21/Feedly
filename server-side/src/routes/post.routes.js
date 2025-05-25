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
  getCommentReplies,
  deleteComment,
  toggleCommentLike,
  getCommentLikes,
  searchPosts,
} = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware"); // Your auth middleware

// Create a post (with authentication)
router.post("/", authMiddleware, createPost);

// Get all posts
router.get("/", getAllPosts);
//search for posts
router.get("/search", searchPosts);

// Get a post by ID
router.get("/:id", getPostById);

// Edit a post (with authentication, only the post owner can edit)
router.put("/:id", authMiddleware, upload.single("image"), editPost);

// Delete a post (with authentication, only the post owner can delete)
router.delete("/:id", authMiddleware, deletePost);

router.put("/:id/like", authMiddleware, toggleReaction);

// comments
// Add comment to post
router.post("/:postId/comments", authMiddleware, addComment);

// Get comments for post
router.get("/:postId/comments", getPostComments);

// Get replies for comment
router.get("/comments/:commentId/replies", getCommentReplies);

// Delete comment
router.delete("/comments/:commentId", authMiddleware, deleteComment);

router.post("/comments/:commentId/like", authMiddleware, toggleCommentLike);
router.get("/comments/:commentId/likes", getCommentLikes);
module.exports = router;
