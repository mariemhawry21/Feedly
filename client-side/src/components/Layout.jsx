import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import {
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Outlet, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ListIcon from "@mui/icons-material/List";
import { useFilter } from "../contexts/FilterContext";
import { uploadToCloudinary } from "../services/postService"; // Import your upload service
import { updateUserProfile } from "../services/authService";
const drawerWidth = 240;
function Layout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const { searchTerm, setSearchTerm, setFilters } = useFilter();
  const [searchLoading, setSearchLoading] = React.useState(false);

  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleAvatarClick = () => {
    setAvatarDialogOpen(true);
  };

  const handleCloseAvatarDialog = () => {
    setAvatarDialogOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedFile);

      // Update user profile with new avatar URL
      const response = await updateUserProfile(auth.user._id, {
        avatar: imageUrl,
      });
      console.log(response);
      // Axios puts the response data in response.data
      auth.updateUser(response.data);
      handleCloseAvatarDialog();
    } catch (error) {
      console.error("Upload error:", error);

      // Show error to user
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Request error:", error.message);
      }
    } finally {
      setUploading(false);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);

    // Simulate async search or debounce logic here
    setTimeout(() => {
      setSearchLoading(false);
    }, 500);
  };
  const drawer = (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      onClick={() => mobileOpen && handleDrawerToggle()}
      style={{ overflowX: "hidden", width: "100%" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          p: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Typography variant="h4" noWrap>
            Feedly
          </Typography>
        </motion.div>
        <Typography variant="body1" sx={{ opacity: 0.8, mt: 2 }}>
          Hi, {auth.user?.firstname}
        </Typography>
      </Toolbar>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={motion.div}
            onClick={() => setFilters("all")}
            whileHover={{ scale: 1.05, backgroundColor: "#1565c0" }}
            transition={{ duration: 0.2 }}
            sx={{ alignItems: "center", display: "flex" }}
          >
            <ListItemIcon>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ListIcon sx={{ color: "#fff" }} />
              </motion.div>
            </ListItemIcon>
            <ListItemText primary="All Posts" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={motion.div}
            whileHover={{ scale: 1.05, backgroundColor: "#1565c0" }}
            transition={{ duration: 0.2 }}
            onClick={() => setFilters("my")}
            sx={{ alignItems: "center", display: "flex" }}
          >
            <ListItemIcon>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PostAddIcon sx={{ color: "#fff" }} />
              </motion.div>
            </ListItemIcon>
            <ListItemText primary="My Posts" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ borderColor: "#fff", opacity: 0.3 }} />

      <List
        sx={{ position: "absolute", bottom: 0, width: "100%" }}
        style={{ overflowX: "hidden", width: "100%" }}
      >
        <ListItem disablePadding>
          <ListItemButton
            whileHover={{ scale: 1.05 }}
            component={motion.div}
            onClick={() => {
              auth.logout();
              navigate("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </motion.div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {location.pathname === "/" && (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <TextField
                size="small"
                placeholder="Search posts"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="search posts"
                fullWidth
                sx={{maxWidth:"500px"}}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        searchTerm && (
                          <IconButton
                            size="small"
                            onClick={() => setSearchTerm("")}
                            aria-label="clear search"
                          >
                            <ClearIcon />
                          </IconButton>
                        )
                      )}
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "20px" },
                }}
              />
              {auth.user ? (
                <Tooltip title={auth.user.firstname}>
                  <Avatar
                    loading="lazy"
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={handleAvatarClick}
                    src={auth.user.avatar}
                  >
                    {auth.user.firstname.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </Tooltip>
              ) : (
                <Button variant="contained" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </Box>
          )}

          {location.pathname === "/create" && (
            <Typography variant="h6" noWrap component="div">
              Create Post
            </Typography>
          )}

          {location.pathname.startsWith("/edit") && (
            <Typography variant="h6" noWrap component="div">
              Edit Post
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1976d2",
              color: "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1976d2",
              color: "#fff",
            },
          }}
          open
          PaperProps={{
            component: motion.div,
            initial: { x: -100, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { duration: 0.4 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      {/* Avatar Upload Dialog */}
      <Dialog open={avatarDialogOpen} onClose={handleCloseAvatarDialog}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          {selectedFile ? (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Avatar
                src={URL.createObjectURL(selectedFile)}
                sx={{ width: 120, height: 120, margin: "0 auto" }}
              />
            </Box>
          ) : (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Avatar
                src={auth.user?.avatar}
                sx={{ width: 120, height: 120, margin: "0 auto" }}
              >
                {auth.user?.firstname.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="avatar-upload">
              <Button variant="contained" component="span" fullWidth>
                Choose Image
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvatarDialog}>Cancel</Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            variant="contained"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
