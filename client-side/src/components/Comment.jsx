import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Stack,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  Reply,
  MoreVert,
  People,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import CommentForm from "./CommentForm";
import {
  deleteComment,
  likeComment,
  fetchCommentLikes,
} from "../services/postService";

const Comment = ({ comment, onReply, currentUser, onDelete, replies = [] }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likesData, setLikesData] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLikesDialog, setShowLikesDialog] = useState(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  const isAuthor = currentUser?._id === comment.user?._id;

  useEffect(() => {
    if (comment) {
      const userLike = comment.likes?.some(
        (like) =>
          like.user?._id === currentUser?._id ||
          like.user?.toString() === currentUser?._id
      );
      setIsLiked(userLike || false);
      setLikeCount(comment.likeCount || comment.likes?.length || 0);
    }
  }, [comment, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const newLikeStatus = !isLiked;
      setIsLiked(newLikeStatus);
      setLikeCount(newLikeStatus ? likeCount + 1 : likeCount - 1);

      const response = await likeComment(comment._id);

      if (response.comment) {
        setIsLiked(
          response.comment.likes.some(
            (like) =>
              like.user?._id === currentUser._id ||
              like.user?.toString() === currentUser._id
          )
        );
        setLikeCount(response.comment.likeCount);
      }
    } catch (error) {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      console.error("Error toggling like:", error);
    }
  };

  const handleShowLikes = async () => {
    setShowLikesDialog(true);
    if (likesData.length === 0) {
      try {
        setIsLoadingLikes(true);
        const { likes } = await fetchCommentLikes(comment._id);
        setLikesData(likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setIsLoadingLikes(false);
      }
    }
  };

  const handleReply = (content) => {
    onReply(content, comment._id);
    setShowReplyForm(false);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ mb: 1.5, "&:last-child": { mb: 0 }, width: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar
          src={comment.user?.avatar}
          alt={comment.user?.firstname}
          sx={{ width: 32, height: 32, mt: 0.5 }}
        />
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              bgcolor: "action.hover",
              borderRadius: "18px",
              p: 1.5,
              position: "relative",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.user?.firstname} {comment.user?.lastname}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {comment.content}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 1,
                color: "text.secondary",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </Typography>

              {likeCount > 0 && (
                <Typography
                  variant="caption"
                  onClick={handleShowLikes}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {likeCount} like{likeCount !== 1 ? "s" : ""}
                </Typography>
              )}

              {isAuthor && (
                <>
                  <IconButton
                    size="small"
                    sx={{ p: 0, ml: 1 }}
                    onClick={handleMenuClick}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 1 }}>
            <Tooltip title={isLiked ? "Unlike" : "Like"}>
              <IconButton
                size="small"
                onClick={handleLike}
                sx={{
                  color: isLiked ? "error.main" : "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isLiked ? (
                  <Favorite fontSize="small" />
                ) : (
                  <FavoriteBorder fontSize="small" />
                )}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Like
                </Typography>
              </IconButton>
            </Tooltip>

         
            <Tooltip title="Reply">
              <IconButton
                size="small"
                onClick={() => setShowReplyForm(!showReplyForm)}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Reply fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Reply
                </Typography>
              </IconButton>
            </Tooltip>

            {likeCount > 0 && (
              <Tooltip title="View likes">
                <IconButton
                  size="small"
                  onClick={handleShowLikes}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <People fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Collapse in={showReplyForm}>
            <Box sx={{ mt: 1, ml: 4 }}>
              <CommentForm onSubmit={handleReply} />
            </Box>
          </Collapse>

          {replies.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "text.secondary",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? "Hide replies"
                  : `Show replies (${replies.length})`}
              </Typography>

              <Collapse in={showReplies}>
                <Box sx={{ mt: 1, ml: 4 }}>
                  {replies.map((reply) => (
                    <Comment
                      key={reply._id}
                      comment={reply}
                      replies={reply.replies || []}
                      onReply={onReply}
                      currentUser={currentUser}
                      onDelete={onDelete}
                    />
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Stack>

      <Dialog open={showLikesDialog} onClose={() => setShowLikesDialog(false)}>
        <DialogTitle>Likes</DialogTitle>
        <DialogContent>
          {isLoadingLikes ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : likesData.length > 0 ? (
            <List>
              {likesData.map((like) => (
                <ListItem key={like._id}>
                  <ListItemAvatar>
                    <Avatar src={like.user?.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${like.user?.firstname} ${like.user?.lastname}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ p: 2 }}>
              No likes yet
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLikesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Comment;
