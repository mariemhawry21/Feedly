import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import PostsList from "../components/PostList";

const Home = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleAddClick = () => {
    if (isLoggedIn) {
      navigate("/create");
    } else {
      setOpen(true);
    }
  };

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };
  const handleRequireLogin = () => {
    setOpen(true);
  };
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <Box sx={{ p: 2 }}>
      <Container>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ mb: 3 }}
        >
          Add Post
        </Button>

        <PostsList handleRequireLogin={handleRequireLogin} />
      </Container>

      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              "& .MuiDialog-paper": {
                overflow: "hidden",
                borderRadius: "12px",
                p: 0,
                background: "#f9f9f9",
              },
            }}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
                Please login first
              </DialogTitle>

              <DialogContent>
                <Typography align="center" sx={{ mb: 2 }}>
                  You must be logged in to create a new post.
                </Typography>
              </DialogContent>

              <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleLogin}>
                  Login
                </Button>
              </DialogActions>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Home;
