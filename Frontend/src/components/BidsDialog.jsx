// src/components/BidsDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";

export default function BidsDialog({ open, onClose, task, handleSelectBid }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Bids for "{task?.title}"</DialogTitle>
      <DialogContent>
        {task?.bids?.length > 0 ? (
          <List>
            {task.bids.map((bid, index) => {
              const provider = bid.providerId || {};
              return (
                <ListItem
                  key={index}
                  divider
                  alignItems="flex-start"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: 1,
                    py: 2,
                  }}
                >
                  {/* Provider Info */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar src="/broken-image.jpg" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {provider.name || "Unknown Provider"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ⭐ {provider.averageRating || 0} / 5
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Bid Info */}
                  <ListItemText
                    primary={`Bid #${index + 1}`}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Proposed Cost:</strong> ₹{bid.proposedCost}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Proposed Time:</strong>{" "}
                          {new Date(bid.proposedTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong>{" "}
                          <Chip
                            label={bid.status}
                            color={
                              bid.status === "accepted"
                                ? "success"
                                : bid.status === "rejected"
                                ? "error"
                                : "default"
                            }
                            size="small"
                          />
                        </Typography>
                      </Box>
                    }
                  />

                  {/* Action */}
                  <ListItemSecondaryAction sx={{ mt: 1 }}>
                    {bid.status === "pending" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectBid(task._id, bid._id)}
                      >
                        Select Provider
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
              );
            })}
          </List>
        ) : (
          <Typography>No bids available for this task.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
