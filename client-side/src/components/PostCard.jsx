import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  MoreVert,
  Share,
  ContentCopy,
  Twitter,
  Facebook,
  Close,
  ChatBubbleOutline,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addComment, deletePost, getComments } from "../services/postService";
import haha from "../assets/haha.svg";
import care from "../assets/care.svg";
import sad from "../assets/sad.svg";
import love from "../assets/love.svg";
import like from "../assets/like.svg";
import wow from "../assets/wow.svg";
import angry from "../assets/angry.svg";
import close from "../assets/close.svg";
import thumbUp from "../assets/thumbUp.svg";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { toast } from "react-toastify";
const LikeIcon = (props) => (
  <img
    src={like}
    alt="like"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const LoveIcon = (props) => (
  <img
    src={love}
    alt="love"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const HahaIcon = (props) => (
  <img
    src={haha}
    alt="haha"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const WowIcon = (props) => (
  <img
    src={wow}
    alt="wow"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const CareIcon = (props) => (
  <img
    src={care}
    alt="care"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const SadIcon = (props) => (
  <img
    src={sad}
    alt="sad"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const AngryIcon = (props) => (
  <img
    src={angry}
    alt="angry"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const CloseIcon = (props) => (
  <img
    src={close}
    alt="close"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);
const ThumbUp = (props) => (
  <img
    src={thumbUp}
    alt="thumpUp"
    width={28}
    height={28}
    style={{ display: "block", ...props.style }}
    {...props}
  />
);

// Reaction types with proper styling
const reactionTypes = [
  {
    name: "like",
    icon: LikeIcon,
  },
  {
    name: "love",
    icon: LoveIcon,
  },
  {
    name: "haha",
    icon: HahaIcon,
  },

  {
    name: "care",
    icon: CareIcon,
  },
  {
    name: "sad",
    icon: SadIcon,
  },
  {
    name: "angry",
    icon: AngryIcon,
  },
];

// Separate remove reaction option
const removeReactionOption = {
  name: null,
  icon: CloseIcon,
};

const PostCard = ({ post, onReact, onDelete, handleRequireLogin }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reactionAnchor, setReactionAnchor] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Add these new states for comments
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [loadingComments, setLoadingComments] = useState(false);
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
      toast.success("post deleted successfully");
      onDelete(post._id);
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
      toast.success("error deleted post");
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
    if (!userReaction) {
      return (
        <>
          <ThumbUpAltOutlined
            sx={{
              fontSize: { xs: 20, md: 28 },
              color: "black",
              opacity: 0.6,
              "&:hover": { transform: "scale(1.1)" },
              cursor: "pointer",
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
          <ThumbUpAltOutlined
            sx={{
              fontSize: { xs: 20, md: 28 },
              color: "black",
              opacity: 0.6,
              "&:hover": { transform: "scale(1.1)" },
              cursor: "pointer",
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
          style={{
            animation: `${userReaction ? "bounce 0.5s" : ""}`,
            "&:hover": { transform: "scale(1.1)" },
            cursor: "pointer",
            fontWeight: "bold",
          }}
        />
        <p style={{ marginLeft: "10px", fontWeight: "bold" }}>
          {reaction.name}
        </p>
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

  // Function to fetch comments
  const fetchComments = async () => {
    if (!showComments) return; // Only fetch when comments are shown

    try {
      setLoadingComments(true);
      const { comments } = await getComments(post._id);

      // Initialize with empty replies array if not provided
      setComments(
        comments.map((c) => ({
          ...c,
          replies: c.replies || [],
        }))
      );
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Function to add a new comment
  const handleAddComment = async (content, parentId = null) => {
    if (!user) {
      handleRequireLogin();
      return;
    }

    try {
      const newComment = await addComment(post._id, { content, parentId });
      // Safely update comments state
      if (parentId) {
        // For replies, update only the specific comment's replies
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === parentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newComment],
                  replyCount: (comment.replyCount || 0) + 1,
                }
              : comment
          )
        );
      } else {
        // For top-level comments, add to main comments list
        setComments((prev) => [newComment, ...prev]);
        setCommentCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };
  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };
  // Function to toggle comments visibility
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // Fetch comments when showComments changes
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);
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
          px: 0,
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid #eee",
            width: "100%",
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          {renderReactionSummary()}
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {commentCount > 0 ? commentCount : 0} Comment
            {commentCount !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            marginTop: "2px",
          }}
        >
          <Box
            onMouseEnter={cancelPopoverClose}
            onMouseLeave={handlePopoverClose}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "space-between",
              width: "100%",
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
                width: "100%",
                ":hover": {
                  color: "black",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                },
              }}
            >
              {renderReactionIcon()}
            </Box>
            {/* Comment button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                ":hover": {
                  color: "black",
                  backgroundColor: "#eee",
                  cursor: "pointer",
                },
              }}
            >
              <Box
                onClick={toggleComments}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ChatBubbleOutline
                  s
                  sx={{
                    fontSize: { xs: 20, md: 28 },
                    color: "black",
                    opacity: 0.6,
                  }}
                />
                <p style={{ marginLeft: "10px" }}>Comment</p>
              </Box>
            </Box>
            {/* Share Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                ":hover": {
                  color: "black",
                  backgroundColor: "#eee",
                },
              }}
            >
              <IconButton aria-label="share" onClick={handleShareClick}>
                <Share
                  sx={{
                    fontSize: { xs: 20, md: 28 },
                    color: "black",
                    opacity: 0.6,
                  }}
                />
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
                  display: "flex",
                  borderRadius: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  p: 1,
                  gap: 1,
                  justifyContent: "center",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  "& .MuiIconButton-root:hover": { transform: "scale(1.3)" },
                }}
              >
                {reactionTypes.map((reaction) => {
                  const IconComponent = reaction.icon;
                  return (
                    <IconButton
                      key={reaction.name}
                      onClick={(e) => {
                        e.preventDefault();
                        handleReactionClick(reaction);
                      }}
                    >
                      <IconComponent />
                    </IconButton>
                  );
                })}
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
        {/* Comments section */}
        {showComments && (
          <Box sx={{ width: "100%", p: 2 }}>
            {/* Comments list */}
            {loadingComments ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : comments.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    replies={comment.replies || []} // Pass replies as prop
                    onReply={handleAddComment}
                    currentUser={user}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                No comments yet. Be the first to comment!
              </Typography>
            )}
            {/* Comment form */}
            <CommentForm onSubmit={handleAddComment} />
          </Box>
        )}
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
