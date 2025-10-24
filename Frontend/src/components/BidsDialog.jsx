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
} from "@mui/material";

export default function BidsDialog({ open, onClose, task, handleSelectBid }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Bids for "{task?.title}"</DialogTitle>
      <DialogContent>
        {task?.bids?.length > 0 ? (
          <List>
            {task.bids.map((bid, index) => (
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
                      onClick={() => handleSelectBid(task._id, bid._id)}
                    >
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
