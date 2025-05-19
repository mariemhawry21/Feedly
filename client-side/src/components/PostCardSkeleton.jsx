import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Skeleton,
  Box,
} from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <Card
      sx={{
        maxWidth: "100%",
        mb: 3,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        action={
          <IconButton disabled>
            <Skeleton variant="circular" width={24} height={24} />
          </IconButton>
        }
        title={<Skeleton width="40%" />}
        subheader={<Skeleton width="30%" />}
      />

      <CardContent>
        <Box sx={{ mt: 2 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ borderRadius: "8px" }}
          />
        </Box>
        <Skeleton width="60%" height={32} sx={{ mt: 2 }} />
        <Skeleton width="90%" />
        <Skeleton width="85%" />
        <Skeleton width="40%" />
      </CardContent>

      <CardActions disableSpacing>
        <IconButton disabled>
          <Skeleton variant="circular" width={24} height={24} />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>
          <Skeleton width={20} />
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PostCardSkeleton;
