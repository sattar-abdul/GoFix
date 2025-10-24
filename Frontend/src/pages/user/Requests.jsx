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
  CardMedia,
} from "@mui/material";
import { tasksAPI, bidsAPI } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import DefaultImg from "../../assets/default-service.jpg";

export default function Requests() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();

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

  const openBidsDialog = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const openRatingDialog = (task) => {
    setSelectedTask(task);
    setRatingDialogOpen(true);
  };

  const handleSelectBid = async (taskId, bidId) => {
    try {
      await bidsAPI.selectBid({ taskId, bidId });
      setMessage("Provider selected successfully! ✅");
      setDialogOpen(false);
      fetchUserTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to select provider");
    }
  };

  const handleSubmitRating = async () => {
    try {
      await tasksAPI.rateProvider(selectedTask._id, { score: rating, review });
      setMessage("Rating submitted successfully! ✅");
      setRatingDialogOpen(false);
      setRating(0);
      setReview("");
      fetchUserTasks();
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

  if (loading) return <Typography>Loading your requests...</Typography>;

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
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              You haven't posted any service requests yet. Create one to get started!
            </Typography>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <Card>
                {/* Task Image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={task.image || DefaultImg}
                  alt={task.title}
                />

                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                  </Box>

                  <Chip label={task.category} color="primary" size="small" sx={{ mb: 1 }} />

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" display="block">
                    Bids: {task.bids?.length || 0}
                  </Typography>

                  {task.selectedProviderId && (
                    <Typography variant="caption" color="success.main" display="block">
                      Provider Selected: {task.selectedProviderId.name || "Unknown"}
                      {task.selectedProviderId?.averageRating && (
                        <span> (⭐ {task.selectedProviderId.averageRating})</span>
                      )}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ flexDirection: "column", gap: 1 }}>
                  {/* View Bids button */}
                  {task.status === "open" && task.bids?.length > 0 && (
                    <Button variant="contained" fullWidth onClick={() => openBidsDialog(task)}>
                      View Bids ({task.bids.length})
                    </Button>
                  )}

                  {/* Rate Provider button */}
                  {task.status === "completed" && !task.rating?.score && (
                    <Button variant="contained" color="primary" fullWidth onClick={() => openRatingDialog(task)}>
                      Rate Provider
                    </Button>
                  )}

                  {/* Chat button */}
                  {task.selectedProviderId && task.status !== "open" && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate(`/user/chat/${task._id}`)}
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bids for "{selectedTask?.title}"</DialogTitle>
        <DialogContent>
          {selectedTask?.bids?.length > 0 ? (
            <List>
              {selectedTask.bids.map((bid, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Bid #${index + 1}`}
                    secondary={
                      <Box>
                        <Typography variant="body2"><strong>Proposed Cost:</strong> ${bid.proposedCost}</Typography>
                        <Typography variant="body2"><strong>Proposed Time:</strong> {new Date(bid.proposedTime).toLocaleDateString()}</Typography>
                        <Typography variant="body2"><strong>Status:</strong> {bid.status}</Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {bid.status === "pending" && (
                      <Button variant="contained" color="primary" onClick={() => handleSelectBid(selectedTask._id, bid._id)}>
                        Select
                      </Button>
                    )}
                    {bid.status === "accepted" && <Chip label="Selected" color="success" />}
                    {bid.status === "rejected" && <Chip label="Rejected" color="error" />}
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
      <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Provider for "{selectedTask?.title}"</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography variant="h6">How would you rate this service?</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} size="large" />
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
          <Button onClick={handleSubmitRating} variant="contained" disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
