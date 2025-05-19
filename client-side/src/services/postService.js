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
