// src/pages/user/Requests.jsx

import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Rating,
  Stack,
} from "@mui/material";
import { tasksAPI, bidsAPI } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function Requests() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      const response = await tasksAPI.getUserTasks();
      setTasks(response.data);
    } catch (error) {
      setMessage("Failed to fetch your tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBid = async (taskId, bidId) => {
    try {
      console.log("Selecting bid:", { taskId, bidId });
      const response = await bidsAPI.selectBid({ taskId, bidId });
      console.log("Bid selection response:", response.data);
      setMessage("Provider selected successfully! ✅");
      setDialogOpen(false);
      fetchUserTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error selecting bid:", error);
      setMessage(error.response?.data?.message || "Failed to select provider");
    }
  };

  const openBidsDialog = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const openRatingDialog = (task) => {
    setSelectedTask(task);
    setRatingDialogOpen(true);
  };

  const handleSubmitRating = async () => {
    try {
      await tasksAPI.rateProvider(selectedTask._id, {
        score: rating,
        review: review,
      });
      setMessage("Rating submitted successfully! ✅");
      setRatingDialogOpen(false);
      setRating(0);
      setReview("");
      fetchUserTasks(); // Refresh tasks
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "primary";
      case "assigned":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Typography>Loading your requests...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Service Requests
      </Typography>

      {message && (
        <Alert
          severity={message.includes("successfully") ? "success" : "error"}
          sx={{ mb: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {tasks.length === 0 ? (
          <Grid size={12}>
            <Typography variant="body1" color="text.secondary">
              You haven't posted any service requests yet. Create one to get
              started!
            </Typography>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid size={{ xs: 12, md: 6 }} key={task._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">{task.title}</Typography>
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

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description}
                  </Typography>

                  {task.image && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <img
                        src={task.image}
                        alt={task.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Bids: {task.bids?.length || 0}
                  </Typography>

                  {task.selectedProviderId && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      display="block"
                    >
                      Provider Selected:{" "}
                      {task.selectedProviderId?.name || "Unknown"}
                      {task.selectedProviderId?.averageRating && (
                        <span>
                          {" "}
                          (⭐ {task.selectedProviderId.averageRating})
                        </span>
                      )}
                    </Typography>
                  )}

                  {task.status === "completed" && task.rating && (
                    <Typography
                      variant="caption"
                      color="primary.main"
                      display="block"
                    >
                      ✅ Task completed on{" "}
                      {new Date(task.completedAt).toLocaleDateString()}
                      {task.rating.score && (
                        <span> - Rated: ⭐ {task.rating.score}/5</span>
                      )}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  {/* View Bids button */}
                  {task.status === "open" &&
                    task.bids &&
                    task.bids.length > 0 && (
                      <Button
                        variant="contained"
                        onClick={() => openBidsDialog(task)}
                        fullWidth
                      >
                        View Bids ({task.bids.length})
                      </Button>
                    )}

                  {/* Rate Provider button */}
                  {task.status === "completed" && !task.rating?.score && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openRatingDialog(task)}
                      fullWidth
                    >
                      Rate Provider
                    </Button>
                  )}

                  {/* Chat button for user side */}
                  {task.selectedProviderId && task.status !== "open" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/user/chat/${task._id}`)}
                      fullWidth
                    >
                      Chat with Provider
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Bids Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bids for "{selectedTask?.title}"</DialogTitle>
        <DialogContent>
          {selectedTask?.bids && selectedTask.bids.length > 0 ? (
            <List>
              {selectedTask.bids.map((bid, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Bid #${index + 1}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          <strong>Proposed Cost:</strong> ${bid.proposedCost}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Proposed Time:</strong>{" "}
                          {new Date(bid.proposedTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {bid.status}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {bid.status === "pending" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleSelectBid(selectedTask._id, bid._id)
                        }
                      >
                        Select
                      </Button>
                    )}
                    {bid.status === "accepted" && (
                      <Chip label="Selected" color="success" />
                    )}
                    {bid.status === "rejected" && (
                      <Chip label="Rejected" color="error" />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No bids available for this task.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate Provider for "{selectedTask?.title}"</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">
              How would you rate this service?
            </Typography>

            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />

            <TextField
              label="Write a review (optional)"
              multiline
              rows={3}
              fullWidth
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this provider..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={rating === 0}
          >
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
