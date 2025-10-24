// frontend/src/pages/user/MyListings.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { getUserTasks, deleteTask } from "../../api/tasks";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await getUserTasks();
      setTasks(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      alert("Deleted");
      fetch();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Listings
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : tasks.length === 0 ? (
        <Typography>No listings yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} key={task._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {task.description}
                  </Typography>
                  <Typography variant="caption">
                    Category: {task.category}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/user/listing/${task._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/user/requests/${task._id}`)}
                    >
                      View Bids
                    </Button>
                  </Box>

                  {/* show selected provider if any */}
                  {task.selectedProviderId && (
                    <Typography sx={{ mt: 1 }}>
                      Assigned to: {task.selectedProviderId}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyListings;
