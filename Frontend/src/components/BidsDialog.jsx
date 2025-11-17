// src/components/BidsDialog.jsx
import { useState } from "react";
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
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import BidsMap from "./BidsMap.jsx";

export default function BidsDialog({ open, onClose, task, handleSelectBid }) {
  const [tab, setTab] = useState(0);
  const [userLocation, setUserLocation] = useState(null); // { lat, lng } or null
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  // Get user location for map
  const requestUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("Geolocation is not supported by your browser.")
        );
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

  const handleTabChange = async (e, newValue) => {
    setTab(newValue);

    // if switching to Map tab, request location (only if we don't already have it)
    if (newValue === 1 && !userLocation) {
      setLocError("");
      setLocLoading(true);
      try {
        const loc = await requestUserLocation();
        setUserLocation(loc);
      } catch (err) {
        // User denied or timeout or other error
        console.warn("Geolocation error:", err);
        setLocError(
          typeof err === "string"
            ? err
            : err.message || "Unable to get location."
        );
        setUserLocation(null);
      } finally {
        setLocLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Bids for "{task?.title}"</DialogTitle>

      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="List" />
        <Tab label="Map" />
      </Tabs>

      <DialogContent sx={{ minHeight: "400px" }}>
        {tab === 0 && (
          <>
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
                            <Typography variant="body2" component="div">
                              <strong>Proposed Cost:</strong> ₹
                              {bid.proposedCost}
                            </Typography>

                            <Typography variant="body2" component="div">
                              <strong>Proposed Time:</strong>{" "}
                              {new Date(bid.proposedTime).toLocaleDateString()}
                            </Typography>

                            <Typography variant="body2" component="div">
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
          </>
        )}

        {/* ---------------- MAP TAB ---------------- */}
        {tab === 1 && (
          <Box sx={{ height: "400px", position: "relative" }}>
            {locLoading ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : locError ? (
              <Box sx={{ p: 2 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {locError}
                </Alert>
                <Button
                  variant="contained"
                  onClick={async () => {
                    setLocError("");
                    setLocLoading(true);
                    try {
                      const loc = await requestUserLocation();
                      setUserLocation(loc);
                    } catch (err) {
                      setLocError(err.message || "Unable to get location.");
                      setUserLocation(null);
                    } finally {
                      setLocLoading(false);
                    }
                  }}
                >
                  Retry Location
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  You can still view provider locations, but the map will center
                  on providers until you allow location.
                </Typography>
              </Box>
            ) : (
              // pass userLocation (may be null) to BidsMap
              <BidsMap
                bids={task?.bids || []}
                userLocation={userLocation}
                handleSelectBid={handleSelectBid}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
