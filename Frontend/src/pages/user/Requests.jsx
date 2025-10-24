// src/pages/user/Requests.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { tasksAPI } from "../../utils/api.js";
import TaskCard from "../../components/TaskCard.jsx";
import BidsDialog from "../../components/BidsDialog.jsx";
import RatingDialog from "../../components/RatingDialog.jsx";

export default function Requests() {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "primary";
      case "assigned": return "success";
      case "completed": return "default";
      default: return "default";
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
      await tasksAPI.selectBid({ taskId, bidId });
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom>My Service Requests</Typography>

      {message && (
        <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : tasks.length === 0 ? (
          <Typography color="text.secondary">You haven't posted any service requests yet. Create one to get started!</Typography>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <TaskCard task={task} getStatusColor={getStatusColor} openBidsDialog={openBidsDialog} openRatingDialog={openRatingDialog} />
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialogs */}
      <BidsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} task={selectedTask} handleSelectBid={handleSelectBid} />
      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        task={selectedTask}
        rating={rating}
        setRating={setRating}
        review={review}
        setReview={setReview}
        handleSubmitRating={handleSubmitRating}
      />
    </Box>
  );
}
