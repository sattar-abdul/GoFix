// src/components/RatingDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Rating,
} from "@mui/material";

export default function RatingDialog({ open, onClose, task, rating, setRating, review, setReview, handleSubmitRating }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rate Provider for "{task?.title}"</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmitRating} variant="contained" disabled={rating === 0}>
          Submit Rating
        </Button>
      </DialogActions>
    </Dialog>
  );
}
