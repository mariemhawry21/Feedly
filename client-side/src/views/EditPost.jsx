import { Box, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  getPostById,
  updatePost,
  uploadToCloudinary,
} from "../services/postService";
import { toast } from "react-toastify";

const formStyle = {
  margin: "20px auto",
  padding: 20,
  border: "1px solid #ccc",
  borderRadius: 6,
  fontFamily: "Arial, sans-serif",
  width: "100%",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginBottom: 12,
  borderRadius: 4,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "200px",
  padding: "10px 15px",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const fileBoxStyle = {
  border: "2px dashed #ccc",
  borderRadius: 10,
  padding: 30,
  cursor: "pointer",
  color: "black",
  fontSize: 16,
  textAlign: "center",
  marginBottom: 12,
};

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        console.log("post data", data);
        setTitle(data.title);
        setBody(data.body);
        setImagePreview(data.imageUrl || null);
      } catch (err) {
        toast.error("Failed to load post");
        console.log(err);
      }
    };
    loadPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !body) {
      toast.error("Title and description are required");
      setLoading(false);
      return;
    }

    let imageUrl = imagePreview;

    if (image) {
      try {
        setUploading(true);
        imageUrl = await uploadToCloudinary(image);
        setUploading(false);
      } catch (error) {
        toast.error("Image upload failed");
        setLoading(false);
        setUploading(false);
        console.log(error);
        return;
      }
    }

    const payload = {
      title,
      body,
      image: imageUrl,
    };

    try {
      await updatePost(id, payload);
      toast.success("post updated");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Box sx={{ padding: "20px", width: "100%" }}>
      <Button
        onClick={() => navigate("/")}
        startIcon={<ArrowBackIcon />}
        style={{ marginBottom: 10, textTransform: "none" }}
      >
        Back
      </Button>

      <motion.form
        onSubmit={handleSubmit}
        style={formStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Description</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ ...inputStyle, height: 80 }}
          required
        />

        <label style={labelStyle}>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <div onClick={() => inputRef.current.click()} style={fileBoxStyle}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                display: "block",
                margin: "0 auto",
              }}
            />
          ) : (
            <>
              <div style={{ fontSize: 24, marginBottom: 10 }}>＋</div>
              <div>Add image</div>
              <div style={{ fontSize: 12, color: "#888" }}>Click to select</div>
            </>
          )}
        </div>

        {image && (
          <div style={{ fontSize: 14, color: "#444", marginBottom: 12 }}>
            Selected: {image.name}
          </div>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || uploading}
          component={motion.button}
          whileTap={{ scale: 0.95 }}
          style={buttonStyle}
        >
          {!loading && !uploading && "Update Post"}
          {(loading || uploading) && (
            <motion.div
              style={{
                width: 20,
                height: 20,
                border: "3px solid white",
                borderTopColor: "transparent",
                borderRadius: "50%",
                margin: "0 auto",
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
        </Button>
      </motion.form>
    </Box>
  );
};

export default EditPost;
