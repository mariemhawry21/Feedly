import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Popover,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import {
  MoreVert,
  ThumbUpAlt,
  Favorite,
  SentimentSatisfied,
  EmojiObjects,
  SentimentDissatisfied,
  Whatshot,
  Share,
  ContentCopy,
  Twitter,
  Facebook,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../services/postService";
// Reaction types with proper styling
const reactionTypes = [
  {
    name: "like",
    icon: ThumbUpAlt,
    color: "primary",
    customColor: "#1976d2",
  },
  {
    name: "love",
    icon: Favorite,
    color: "error",
    customColor: "#f44336",
  },
  {
    name: "haha",
    icon: SentimentSatisfied,
    color: "warning",
    customColor: "#ff9800",
  },
  {
    name: "wow",
    icon: EmojiObjects,
    color: "warning",
    customColor: "#ffc107",
  },
  {
    name: "sad",
    icon: SentimentDissatisfied,
    color: "info",
    customColor: "#2196f3",
  },
  {
    name: "angry",
    icon: Whatshot,
    color: "error",
    customColor: "#d32f2f",
  },
];

// Separate remove reaction option
const removeReactionOption = {
  name: null,
  icon: Close,
  color: "action",
  customColor: "#757575",
};

const PostCard = ({ post, onReact, onDelete, handleRequireLogin }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isAuthor = user?._id === post.user?._id;
  const openMenu = Boolean(anchorEl);
  const openReactions = Boolean(reactionAnchor);
  const [shareAnchor, setShareAnchor] = useState(null);
  const openShare = Boolean(shareAnchor);
  const shareOptions = [
    {
      name: "Copy Link",
      icon: ContentCopy, // Import from @mui/icons-material
      action: (postId) => {
        navigator.clipboard.writeText(
          `${window.location.origin}/post/${postId}`
        );
        setSnackbarOpen(true);
        handleShareClose();
      },
    },
    {
      name: "Twitter",
      icon: Twitter, // Import from @mui/icons-material
      action: (postId) => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            `${window.location.origin}/post/${postId}`
          )}&text=Check%20out%20this%20post`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: Facebook, // Import from @mui/icons-material
      action: (postId) => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            `${window.location.origin}/post/${postId}`
          )}`,
          "_blank"
        );
      },
    },
  ];
  const handleShareClick = (e) => {
    setShareAnchor(e.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchor(null);
  };
  // Get current user's reaction
  const userReaction = post.reactions?.find(
    (r) => r.user?._id === user?._id || r.user?.toString() === user?._id
  );

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const openConfirmDialog = () => {
    handleMenuClose();
    setConfirmOpen(true);
  };
  const closeConfirmDialog = () => setConfirmOpen(false);
  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit/${post._id}`);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(post._id);
      setConfirmOpen(false);
      onDelete(post._id);
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
    }
  };

  const closeTimeoutRef = React.useRef(null);

  const handleReactionClick = (reaction) => {
    if (!user) {
      handleRequireLogin();
      setReactionAnchor(null);
      return;
    }

    clearTimeout(closeTimeoutRef.current);
    setReactionAnchor(null);

    try {
      const newType =
        reaction?.name === null || userReaction?.type === reaction?.name
          ? null
          : reaction?.name;

      if (typeof newType === "string" || newType === null) {
        onReact(post._id, newType);
      }
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  const renderReactionIcon = () => {
    // Show neutral like icon when no reaction
    if (!userReaction) {
      return (
        <>
          <ThumbUpAlt
            fontSize="medium"
            sx={{
              color: "text.secondary",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
          <p style={{ marginLeft: "10px" }}>like</p>
        </>
      );
    }

    const reaction = reactionTypes.find((r) => r.name === userReaction.type);
    if (!reaction) {
      return (
        <>
          <ThumbUpAlt
            fontSize="medium"
            sx={{
              color: "text.secondary",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
          <p style={{ marginLeft: "10px" }}>like</p>
        </>
      );
    }

    const IconComponent = reaction.icon;
    return (
      <>
        <IconComponent
          fontSize="medium"
          sx={{
            color: reaction.customColor,
            animation: `${userReaction ? "bounce 0.5s" : ""}`,
            "&:hover": { transform: "scale(1.1)" },
            cursor: "pointer",
          }}
        />

        <p style={{ marginLeft: "10px" }}>{reaction.name}</p>
      </>
    );
  };

  const renderReactionSummary = () => {
    if (!post.reactions?.length) return null;

    // Filter out invalid reactions
    const validReactions = post.reactions.filter(
      (reaction) =>
        reaction?.type && reactionTypes.some((r) => r.name === reaction.type)
    );

    if (!validReactions.length) return null;

    const reactionCounts = validReactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    const topReactions = Object.entries(reactionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => {
        const reactionConfig = reactionTypes.find((r) => r.name === type);
        return reactionConfig ? { type, count, ...reactionConfig } : null;
      })
      .filter(Boolean);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
          borderRadius: "16px",
        }}
      >
        {topReactions.map((reaction, index) => (
          <Tooltip title={`${reaction.count} ${reaction.type}`} key={index}>
            <Box sx={{ display: "flex", alignItems: "center", mx: 0.5 }}>
              <reaction.icon
                fontSize="small"
                sx={{ color: reaction.customColor }}
              />
            </Box>
          </Tooltip>
        ))}
        <Typography variant="caption" sx={{ ml: 0.5 }}>
          {validReactions.length}
        </Typography>
      </Box>
    );
  };

  const bounceAnimation = `
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
  `;

  const handleReactionButtonClick = (e) => {
    e.stopPropagation();
    setReactionAnchor(reactionAnchor ? null : e.currentTarget);
  };

  const handlePopoverClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setReactionAnchor(null);
    }, 600);
  };

  const cancelPopoverClose = () => {
    clearTimeout(closeTimeoutRef.current);
  };

  return (
    <Card
      sx={{
        maxWidth: "100%",
        mb: 3,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.user?.avatar}
            alt={post.user?.firstname}
            sx={{ bgcolor: "#1976d2" }}
          >
            {post.user?.firstname?.charAt(0) || "U"}
          </Avatar>
        }
        action={
          isAuthor && (
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
                <MenuItem onClick={openConfirmDialog}>Delete Post</MenuItem>
              </Menu>
            </>
          )
        }
        title={`${post.user?.firstname} ${post.user?.lastname}`}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />

      <CardContent>
        {post.imageUrl && (
          <Box sx={{ mt: 2 }}>
            <img
              src={post.imageUrl}
              alt="Post"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {post.body}
        </Typography>
      </CardContent>

      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid #eee",
            width: "100%",
            paddingBottom: "10px",
          }}
        >
          {renderReactionSummary()}
        </Box>
        <Divider />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box
            onMouseEnter={cancelPopoverClose}
            onMouseLeave={handlePopoverClose}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding:'0 20px'
            }}
          >
            <style>{bounceAnimation}</style>
            <Box
              aria-label="react"
              onClick={handleReactionButtonClick}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderReactionIcon()}
            </Box>
            {/* Share Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton aria-label="share" onClick={handleShareClick}>
                <Share />
              </IconButton>
              <p style={{ marginLeft: "10px" }}>Share</p>
            </Box>
            {/* Share Menu */}
            <Menu
              anchorEl={shareAnchor}
              open={openShare}
              onClose={handleShareClose}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              {shareOptions.map((option) => (
                <MenuItem
                  key={option.name}
                  onClick={() => {
                    option.action(post._id);
                    handleShareClose();
                  }}
                >
                  <ListItemIcon>
                    <option.icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{option.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>

            <Popover
              open={openReactions}
              anchorEl={reactionAnchor}
              onClose={() => setReactionAnchor(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              transformOrigin={{ vertical: "bottom", horizontal: "center" }}
              sx={{
                "& .MuiPopover-paper": {
                  width: "auto",
                  minWidth: "unset",
                  maxWidth: "100%", // Constrain to anchor width
                  borderRadius: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  "& .MuiIconButton-root:hover": { transform: "scale(1.3)" },
                }}
              >
                {reactionTypes.map((reaction) => (
                  <IconButton
                    key={reaction.name}
                    onClick={(e) => {
                      e.preventDefault();
                      handleReactionClick(reaction);
                    }}
                  >
                    <reaction.icon
                      fontSize="large"
                      sx={{ color: reaction.customColor }}
                    />
                  </IconButton>
                ))}
                {userReaction && (
                  <Tooltip title="Remove reaction">
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleReactionClick(removeReactionOption);
                      }}
                    >
                      <Close fontSize="large" sx={{ color: "#757575" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Popover>
          </Box>
        </Box>
      </CardActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
      />
      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
