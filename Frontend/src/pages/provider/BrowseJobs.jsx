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
  TextField,
  InputAdornment,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { tasksAPI, bidsAPI } from "../../utils/api.js";
import DefaultImg from "../../assets/default-service.jpg";

export default function BrowseJobs() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks({});
      setTasks(response.data);
    } catch (error) {
      setMessage("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (taskId) => {
    const proposedCost = prompt("Enter your proposed cost:");
    const proposedTime = prompt("Enter time of arrival (e.g., '2 days'):");

    if (!proposedCost || !proposedTime) return;

    try {
      await bidsAPI.placeBid({
        taskId,
        proposedCost: parseFloat(proposedCost),
        proposedTime: new Date(
          Date.now() + parseInt(proposedTime) * 24 * 60 * 60 * 1000
        ),
      });
      setMessage("Bid placed successfully! ✅");
      fetchTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to place bid");
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  // Search bar
  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();

    return (
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search) ||
      task.category?.toLowerCase().includes(search) ||
      task.city?.toLowerCase().includes(search) ||
      task.state?.toLowerCase().includes(search)
    );
  });

  // Sorting
  const applySorting = (tasksList) => {
    if (sortOption === "newest") {
      return [...tasksList].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (sortOption === "oldest") {
      return [...tasksList].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }
    if (sortOption === "lowestBids") {
      return [...tasksList].sort(
        (a, b) => (a.bids?.length || 0) - (b.bids?.length || 0)
      );
    }
    if (sortOption === "highestBids") {
      return [...tasksList].sort(
        (a, b) => (b.bids?.length || 0) - (a.bids?.length || 0)
      );
    }
    return tasksList;
  };

  const finalTask = applySorting(filteredTasks);

  if (loading) {
    return <Typography>Loading tasks...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Browse Available Jobs
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

      {/* ------- SEARCH BAR ------- */}
      <div display="flex">
      <TextField
        placeholder="Search jobs by title, category, description, or city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, mr: 2, width: "65%" }}
        
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Sorting Dropdown */}
      <TextField
        select
        label="Sort By"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        wi
        sx={{ mb: 3, width: "25%" }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="newest">Newest First</MenuItem>
        <MenuItem value="oldest">Oldest First</MenuItem>
        <MenuItem value="lowestBids">Lowest Bids</MenuItem>
        <MenuItem value="highestBids">Highest Bids</MenuItem>
      </TextField>
      </div>

      <Grid container spacing={2}>
        {finalTask.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No jobs found matching your search.
            </Typography>
          </Grid>
        ) : (
          finalTask.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card
                onClick={() => handleCardClick(task)}
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
                  <Typography variant="h6" gutterBottom>
                    {task.title}
                  </Typography>

                  <Chip
                    label={task.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    📍 {task.city}, {task.state}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Posted by: {task.userId?.name || "Unknown"}
                    {task.userId?.averageRating && (
                      <span> (⭐ {task.userId.averageRating})</span>
                    )}
                  </Typography>

                  {(task.image || DefaultImg) && (
                    <Box sx={{ mt: 1 }}>
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
                  )}

                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Bids: {task.bids?.length || 0}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => handlePlaceBid(task._id)}
                    fullWidth
                  >
                    Place Bid
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTask?.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedTask.image || DefaultImg}
                  alt={selectedTask.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedTask.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📍 {selectedTask.city}, {selectedTask.state}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
