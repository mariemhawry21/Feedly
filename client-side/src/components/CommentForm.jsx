import React, { useState } from "react";
import {
  Box,
  Avatar,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../contexts/AuthContext";

const CommentForm = ({ onSubmit, parentId }) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, parentId);
      setContent("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 2,
        width: "100%",
      }}
    >
      <Avatar
        src={user?.avatar}
        alt={user?.firstname}
        sx={{ width: 32, height: 32 }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                type="submit"
                disabled={!content.trim()}
                sx={{ p: 0.5 }}
              >
                <SendIcon color={content.trim() ? "primary" : "disabled"} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 20,
            backgroundColor: "action.hover",
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Box>
  );
};

export default CommentForm;
