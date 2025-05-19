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
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ListIcon from "@mui/icons-material/List";
const drawerWidth = 240;
// import img from "../assets/freepik__social_media_app_called_feedly.png";
function Layout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
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
  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* <Avatar
          src={img}
          alt="Logo"
          variant="square" // Makes it rectangular instead of circular
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1, // Optional: slight rounding of corners
            objectFit: "contain", // Ensures logo fits properly
          }}
        /> */}
        <Typography variant="h6" noWrap>
          Feedly
        </Typography>
      </Toolbar>

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="All Posts" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/my-posts")}>
            <ListItemIcon>
              <PostAddIcon />
            </ListItemIcon>
            <ListItemText primary="My Posts" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              auth.logout();
              navigate("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
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
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <input
                type="text"
                placeholder="Search posts"
                style={{
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  width: "100%",
                  maxWidth: "500px",
                }}
              />
              {auth.user ? (
                <Avatar
                  sx={{ width: 40, height: 40, cursor: "pointer" }}
                  onClick={() => navigate("/")} // Add profile navigation if needed
                >
                  {auth.user.firstname.charAt(0).toUpperCase() || "U"}
                </Avatar>
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
    </Box>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
