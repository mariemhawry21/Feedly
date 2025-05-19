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

    const comment = new Comment({
      content,
      user: userId,
      post: postId,
      parent: parent || null,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("user", "firstname lastname avatar")
      .populate("parent");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
  toggleReaction,
  addComment,
  getPostComments,
};
