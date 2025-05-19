import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "./PostCard";
import { getPosts, updatePostReaction } from "../services/postService";
import PostCardSkeleton from "./PostCardSkeleton";
import { Box, Container } from "@mui/material";

const PostsList = ({ handleRequireLogin }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      const cleanedPosts = data.map((post) => ({
        ...post,
        reactions: (post.reactions || []).filter((r) => r != null),
      }));
      setPosts(cleanedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      await updatePostReaction(postId, reactionType);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            // Filter out existing reaction from current user
            const filteredReactions = post.reactions.filter(
              (r) => r.user?._id !== user?._id
            );

            // Add new reaction if a type was provided (not undefined)
            const newReactions = reactionType
              ? [
                  ...filteredReactions,
                  { user: { _id: user._id }, type: reactionType },
                ]
              : filteredReactions;

            return { ...post, reactions: newReactions };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Reaction update failed", err);
    }
  };
  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading)
    return (
      <div>
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );

  return (
    <Box sx={{ width: "100%" }}>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onReact={handleReaction}
          onDelete={handleDeletePost}
          handleRequireLogin={handleRequireLogin}
        />
      ))}
    </Box>
  );
};

export default PostsList;
