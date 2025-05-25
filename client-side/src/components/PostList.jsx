import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "./PostCard";
import {
  getPosts,
  updatePostReaction,
  searchPosts,
} from "../services/postService";
import PostCardSkeleton from "./PostCardSkeleton";
import { Box } from "@mui/material";
import { useFilter } from "../contexts/FilterContext";
import { useMemo } from "react";
import { useCallback } from "react";
const PostsList = ({ handleRequireLogin }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { searchTerm, filters } = useFilter();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (searchTerm) {
        data = await searchPosts(searchTerm);
      } else {
        data = await getPosts(filters);
      }
      const cleanedPosts = data.map((post) => ({
        ...post,
        reactions: (post.reactions || []).filter((r) => r != null),
      }));
      setPosts(cleanedPosts);
    } catch (error) {
      setError("Failed to load posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (filters === "my" && user) {
      return posts.filter((post) => post.user._id === user._id);
    }
    return posts;
  }, [posts, filters, user]);

  const handleReaction = async (postId, reactionType) => {
    try {
      await updatePostReaction(postId, reactionType);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const filteredReactions = post.reactions.filter(
              (r) => r.user?._id !== user?._id
            );
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

  if (loading) return <PostCardSkeleton />;

  if (error)
    return (
      <Box>
        <div>{error}</div>
        <button onClick={fetchPosts}>Retry</button>
      </Box>
    );

  return (
    <Box sx={{ width: "100%" }}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onReact={handleReaction}
            onDelete={handleDeletePost}
            handleRequireLogin={handleRequireLogin}
          />
        ))
      ) : (
        <div>No posts found</div>
      )}
    </Box>
  );
};
export default PostsList;
