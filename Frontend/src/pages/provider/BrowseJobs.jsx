import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { tasksAPI, bidsAPI } from "../../utils/api.js";

export default function BrowseJobs() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      setMessage("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (taskId) => {
    const proposedCost = prompt("Enter your proposed cost:");
    const proposedTime = prompt("Enter proposed completion time (e.g., '2 days'):");
    
    if (!proposedCost || !proposedTime) return;

    try {
      await bidsAPI.placeBid({
        taskId,
        proposedCost: parseFloat(proposedCost),
        proposedTime: new Date(Date.now() + parseInt(proposedTime) * 24 * 60 * 60 * 1000),
      });
      setMessage("Bid placed successfully! ✅");
      fetchTasks(); // Refresh tasks
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to place bid");
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <TextField
        fullWidth
        placeholder="Search jobs by title, description, or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        {filteredTasks.length === 0 ? (
          <Grid size={12}>
            <Typography variant="body1" color="text.secondary">
              No jobs found matching your search.
            </Typography>
          </Grid>
        ) : (
          filteredTasks.map((task) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={task._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {task.description}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Posted by: {task.userId?.name || 'Unknown'}
                    {task.userId?.averageRating && (
                      <span> (⭐ {task.userId.averageRating})</span>
                    )}
                  </Typography>
                  
                  {task.image && (
                    <Box sx={{ mt: 1 }}>
                      <img 
                        src={task.image} 
                        alt={task.title}
                        style={{ 
                          width: '100%', 
                          height: '150px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
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
    </Box>
  );
}
