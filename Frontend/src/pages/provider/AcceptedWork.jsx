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
} from "@mui/material";
import { tasksAPI } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import DefaultImg from "../../assets/default-service.jpg";

export default function AcceptedWork() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchAcceptedTasks();
  }, []);

  const fetchAcceptedTasks = async () => {
    try {
      const response = await tasksAPI.getAssignedTasks();
      const currentUserId = localStorage.getItem("userId");

      const acceptedTasks = response.data.filter((task) => {
        const statusMatch =
          task.status === "assigned" || task.status === "completed";
        const providerMatch =
          task.selectedProviderId === currentUserId ||
          task.selectedProviderId?._id === currentUserId ||
          task.selectedProviderId?.toString() === currentUserId;
        return statusMatch && providerMatch;
      });

      setTasks(acceptedTasks);
    } catch (error) {
      console.error("Error fetching accepted work:", error);
      setMessage("Failed to fetch accepted work");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksAPI.completeTask(taskId);
      setMessage("Task completed successfully! ✅");
      setCompleteDialogOpen(false);
      fetchAcceptedTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to complete task");
    }
  };

  const openCompleteDialog = (task) => {
    setSelectedTask(task);
    setCompleteDialogOpen(true);
  };

  if (loading) {
    return <Typography>Loading accepted work...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Accepted Work
      </Typography>

      {message && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {tasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              You don't have any accepted work yet. Keep bidding on jobs!
            </Typography>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={task._id}
              sx={{ display: "flex" }}
            >
              <Card
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
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
                    <Chip label={task.status} color="success" size="small" />
                  </Box>

                  <Chip
                    label={task.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description}
                  </Typography>

                  {(task.image || DefaultImg) && (
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
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Client: {task.userId?.name || "Unknown"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="success.main"
                    display="block"
                  >
                    ✅ Your bid was accepted!
                  </Typography>

                  {task.status === "completed" && (
                    <Typography
                      variant="caption"
                      color="primary.main"
                      display="block"
                    >
                      ✅ Task completed on{" "}
                      {new Date(task.completedAt).toLocaleDateString()}
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
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/provider/chat/${task._id}`)}
                    fullWidth
                  >
                    Chat
                  </Button>

                  {task.status === "assigned" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => openCompleteDialog(task)}
                      fullWidth
                    >
                      Mark as Completed
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>Complete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark "{selectedTask?.title}" as completed?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleCompleteTask(selectedTask?._id)}
            variant="contained"
            color="success"
          >
            Complete Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
