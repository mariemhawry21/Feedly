const Post = require("../models/post.model");
const uploadToImgBB = require("../utils/uploadImgToBB");
const fs = require("fs");

const createPost = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    console.log("Request body:", req.body); // Debug log
    console.log("Authenticated user:", req.user); // Debug log
    const userId = req.user._id; // Assuming user ID is added to the request by auth middleware
    const post = new Post({ title, body, user: userId, imageUrl: image });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Add this to your post.controller.js
const searchPosts = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from URL params
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: "Search query is required" });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { body: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .populate("user", "firstname lastname email avatar")
    .populate("reactions.user", "firstname lastname avatar");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstname lastname email avatar")
      .populate("reactions.user", "firstname lastname avatar"); // Add this

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate(
      "user",
      "firstname lastname email avatar"
    ); // Populate user fields if needed

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, body } = req.body;
    const userId = req.user._id; // User ID from auth middleware

    // Find the post by ID and check if the user owns it
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to edit this post" });
    }

    // Update the post fields
    post.title = title || post.title;
    post.body = body || post.body;

    if (req.file) {
      // If a new image is uploaded, update the image URL
      post.imageUrl = await uploadToImgBB(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id; // User ID from auth middleware

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });
    // console.log("post.user:", post.user);
    // console.log("req.user._id:", userId);

    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const toggleReaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { type } = req.body; // Expecting type: "like", "love", etc.

    // if (!["like", "love", "haha", "wow", "sad", "angry"].includes(type)) {
    //   return res.status(400).json({ error: "Invalid reaction type" });
    // }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Remove any existing reaction by the user
    post.reactions = post.reactions.filter(
      (r) => r.user.toString() !== userId.toString()
    );

    // Add new reaction
    post.reactions.push({ user: userId, type });

    await post.save();

    res.status(200).json({
      message: "Reaction updated",
      reactions: post.reactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Comment = require("../models/comment.model");

const addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const userId = req.user._id;
    const postId = req.params.postId;

    // Validate input
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Check if parent comment exists if provided
    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
    }

    const comment = new Comment({
      content: content.trim(),
      user: userId,
      post: postId,
      parent: parent || null,
    });

    await comment.save();

    // Update post's comment count if not a reply
    if (!parent) {
      await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    }

    // Populate user data before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "firstname lastname avatar")
      .populate("parent");

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error while adding comment" });
  }
};

// Get comments with pagination and sorting
const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get only top-level comments (where parent is null)
    const comments = await Comment.find({ post: postId, parent: null })
      .populate("user", "firstname lastname avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get reply counts for each comment
    const commentIds = comments.map((c) => c._id);
    const [replyCounts, recentReplies] = await Promise.all([
      Comment.aggregate([
        { $match: { parent: { $in: commentIds } } },
        { $group: { _id: "$parent", count: { $sum: 1 } } },
      ]),
      // Get 2 most recent replies for each comment
      Comment.find({ parent: { $in: commentIds } })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate("user", "firstname lastname avatar"),
    ]);

    const commentsWithCounts = comments.map((comment) => {
      const replyCount =
        replyCounts.find((rc) => rc._id.equals(comment._id))?.count || 0;
      const replies = recentReplies
        .filter((reply) => reply.parent.equals(comment._id))
        .slice(0, 2); // Ensure only 2 per comment

      return {
        ...comment.toObject(),
        replyCount,
        replies, // This is virtual - not stored in DB
      };
    });

    res.json({
      comments: commentsWithCounts,
      page,
      limit,
      hasMore: comments.length === limit,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Server error while fetching comments" });
  }
};
// Get replies for a specific comment
const getCommentReplies = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parent: commentId })
      .populate("user", "firstname lastname avatar")
      .populate("likes.user", "firstname lastname avatar") // Add this
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      replies,
      page,
      limit,
      hasMore: replies.length === limit,
    });
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ error: "Server error while fetching replies" });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user is authorized to delete
    if (!comment.user.equals(userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    // Delete the comment and its replies
    await Comment.deleteMany({
      $or: [{ _id: commentId }, { parent: commentId }],
    });

    // Update post's comment count if not a reply
    if (!comment.parent) {
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentCount: -1 },
      });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Server error while deleting comment" });
  }
};

// Like/unlike a comment
const toggleCommentLike = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user already liked the comment
    const likeIndex = comment.likes.findIndex(
      (like) => like.user.toString() === userId.toString()
    );

    if (likeIndex >= 0) {
      // Unlike if already liked
      comment.likes.splice(likeIndex, 1);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // Add like
      comment.likes.push({ user: userId });
      comment.likeCount += 1;
    }

    await comment.save();

    // Populate the user data for the likes
    const populatedComment = await Comment.findById(comment._id)
      .populate("likes.user", "firstname lastname avatar")
      .populate("user", "firstname lastname avatar");

    res.status(200).json({
      message: "Comment like updated",
      comment: populatedComment,
    });
  } catch (err) {
    console.error("Error toggling comment like:", err);
    res.status(500).json({ error: "Server error while toggling comment like" });
  }
};

// Get comment likes
const getCommentLikes = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId).populate(
      "likes.user",
      "firstname lastname avatar"
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({
      likes: comment.likes,
      likeCount: comment.likeCount,
    });
  } catch (err) {
    console.error("Error fetching comment likes:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching comment likes" });
  }
};
module.exports = {
  createPost,
  searchPosts,
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  toggleReaction,
  addComment,
  getPostComments,
  getCommentReplies,
  deleteComment,
  getCommentLikes,
  toggleCommentLike,
};
