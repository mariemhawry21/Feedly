import axios from "axios";
import { getToken } from "../utils/token";

const API = import.meta.env.VITE_API_URL;

export const createPost = async (data) => {
  const token = getToken();
  console.log("Creating post with data:", data); // Debug log

  const response = await axios.post(`${API}/posts`, data, {
    withCredentials: true,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file); // 'image' must match the field name in your backend

    const response = await fetch(`${API}/image/upload`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - the browser will set it automatically with the boundary
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    console.log("Upload response:", data);

    console.log("image url", data.data.imageUrl);
    return data.data.imageUrl; // Updated to match the response structure
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const getPosts = async () => {
  const response = await axios.get(`${API}/posts`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const searchPosts = async (query) => {
  const response = await fetch(
    `${API}/posts/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};
// Add to post.service.js
export const updatePostReaction = async (postId, type) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${API}/posts/${postId}/like`,
      { type }, // Send the reaction type in the body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating reaction:", error);
    throw error;
  }
};
export const getPostById = async (postId) => {
  console.log("get post by id", postId); // Debug log

  const response = await axios.get(`${API}/posts/${postId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const updatePost = async (postId, data) => {
  const token = getToken();
  console.log("updating post with data:", data); // Debug log

  const response = await axios.put(`${API}/posts/${postId}`, data, {
    withCredentials: true,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deletePost = async (postId) => {
  const token = getToken();
  console.log("delete post with id:", postId); // Debug log

  const response = await axios.delete(`${API}/posts/${postId}`, {
    withCredentials: true,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const getComments = async (postId) => {
  try {
    const response = await axios.get(`${API}/posts/${postId}/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("comments for this post", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
export const addComment = async (postId, { content, parentId = null }) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API}/posts/${postId}/comments`,
      { content, parent: parentId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
export const deleteComment = async (commentId) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API}/posts/comments/${commentId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const getCommentReplies = async (commentId) => {
  try {
    const response = await axios.get(
      `${API}/posts/comments/${commentId}/replies`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comment replies:", error);
    throw error;
  }
};

export const likeComment = async (commentId) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API}/posts/comments/${commentId}/like`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};
export const fetchCommentLikes = async (commentId) => {
  try {
    const response = await axios.get(
      `${API}/posts/comments/${commentId}/likes`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    throw error;
  }
};
