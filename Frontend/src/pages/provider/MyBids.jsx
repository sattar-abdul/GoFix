import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Alert,
} from "@mui/material";
import { tasksAPI } from "../../utils/api.js";

export default function MyBids() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      const currentUserId = localStorage.getItem('userId');
      
      // Filter tasks where current user has placed a bid
      const userBids = response.data.filter(task => 
        task.bids && task.bids.some(bid => 
          bid.providerId === currentUserId || 
          bid.providerId?._id === currentUserId ||
          bid.providerId?.toString() === currentUserId
        )
      );
      
      setTasks(userBids);
    } catch (error) {
      setMessage("Failed to fetch your bids");
    } finally {
      setLoading(false);
    }
  };

  const getBidStatus = (task) => {
    const currentUserId = localStorage.getItem('userId');
    const userBid = task.bids?.find(bid => 
      bid.providerId === currentUserId || 
      bid.providerId?._id === currentUserId ||
      bid.providerId?.toString() === currentUserId
    );
    if (!userBid) return null;
    
    switch (userBid.status) {
      case 'accepted':
        return { label: 'Accepted', color: 'success' };
      case 'rejected':
        return { label: 'Rejected', color: 'error' };
      default:
        return { label: 'Pending', color: 'warning' };
    }
  };

  if (loading) {
    return <Typography>Loading your bids...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Bids
      </Typography>

      {message && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {tasks.length === 0 ? (
          <Grid size={12}>
            <Typography variant="body1" color="text.secondary">
              You haven't placed any bids yet. Browse jobs to get started!
            </Typography>
          </Grid>
        ) : (
          tasks.map((task) => {
            const bidStatus = getBidStatus(task);
            const currentUserId = localStorage.getItem('userId');
            const userBid = task.bids?.find(bid => 
              bid.providerId === currentUserId || 
              bid.providerId?._id === currentUserId ||
              bid.providerId?.toString() === currentUserId
            );
            
            return (
              <Grid size={{ xs: 12, md: 6 }} key={task._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6">
                        {task.title}
                      </Typography>
                      {bidStatus && (
                        <Chip 
                          label={bidStatus.label} 
                          color={bidStatus.color} 
                          size="small"
                        />
                      )}
                    </Box>
                    
                    <Chip 
                      label={task.category} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {task.description}
                    </Typography>
                    
                    {userBid && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Your Bid Details:
                        </Typography>
                        <Typography variant="body2">
                          <strong>Proposed Cost:</strong> ₹{userBid.proposedCost}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Proposed Time:</strong> {new Date(userBid.proposedTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {userBid.status}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Posted by: {task.userId?.name || 'Unknown'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
