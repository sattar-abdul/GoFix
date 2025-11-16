// src/components/TaskCard.jsx
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DefaultImg from "../assets/default-service.jpg";

export default function TaskCard({
  task,
  getStatusColor,
  openBidsDialog,
  openRatingDialog,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          maxWidth: 310,
          minWidth: 310,
          width: "100%",
          wordWrap: "break-word",
          overflow: "hidden",
          boxSizing: "border-box",
          cursor: "pointer",
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            {task.title}
          </Typography>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
          />
        </Box>

        <Chip
          label={task.category}
          color="primary"
          size="small"
          sx={{ mb: 1 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          📍 {task.city}, {task.state}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </Typography>

        <Box sx={{ mt: 1, mb: 1 }}>
          <img
            src={task.image || DefaultImg}
            alt={task.title}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" display="block">
          Bids: {task.bids?.length || 0}
        </Typography>

        {task.selectedProviderId && (
          <Typography
            variant="caption"
            color="success.main"
            display="block"
            sx={{ wordBreak: "break-word" }}
          >
            Provider Selected: {task.selectedProviderId?.name || "Unknown"}
            {task.selectedProviderId?.averageRating && (
              <span> (⭐ {task.selectedProviderId.averageRating})</span>
            )}
          </Typography>
        )}

        {task.status === "completed" && task.rating && (
          <Typography variant="caption" color="primary.main" display="block">
            ✅ Task completed on{" "}
            {new Date(task.completedAt).toLocaleDateString()}
            {task.rating?.score && (
              <span> - Rated: ⭐ {task.rating.score}/5</span>
            )}
          </Typography>
        )}
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: "auto",
        }}
      >
        {task.status === "open" && task.bids?.length > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => openBidsDialog(task)}
          >
            View Bids ({task.bids.length})
          </Button>
        )}

        {task.status === "completed" && !task.rating?.score && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => openRatingDialog(task)}
          >
            Rate Provider
          </Button>
        )}

        {task.selectedProviderId && task.status !== "open" && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/user/chat/${task._id}`)}
          >
            Chat with Provider
          </Button>
        )}
      </CardActions>
    </Card>

    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {task.title}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <img
            src={task.image || DefaultImg}
            alt={task.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </Box>
        <Typography variant="body1" paragraph>
          {task.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {task.city}, {task.state}
        </Typography>
      </DialogContent>
    </Dialog>
    </>
  );
}
