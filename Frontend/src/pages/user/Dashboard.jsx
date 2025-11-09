// src/pages/user/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { tasksAPI } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    recentTasks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await tasksAPI.getUserTasks();
      const tasks = res.data || [];

      const completed = tasks.filter((t) => t.status === "completed");
      const pending = tasks.filter((t) => t.status === "open" || t.status === "assigned");
      const total = tasks.length;

      const recentTasks = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setStats({
        totalTasks: total,
        completedTasks: completed.length,
        pendingTasks: pending.length,
        recentTasks,
      });
    } catch (err) {
      console.error("Error fetching user dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Welcome to Your Dashboard 👋
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Post new service requests, manage your active tasks, and review completed ones.
      </Typography>

      {/* STATS CARDS */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="stretch"
        sx={{ mb: 4 }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4" color="primary">
                {stats.totalTasks || 0}
              </Typography>
              <Chip label="Posted" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6">Completed Tasks</Typography>
              <Typography variant="h4" color="success.main">
                {stats.completedTasks || 0}
              </Typography>
              <Chip label="Done" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6">Pending Tasks</Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pendingTasks || 0}
              </Typography>
              <Chip label="Ongoing" color="warning" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/user/post-request")}
        >
          Post Service Request
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate("/user/requests")}
        >
          My Requests
        </Button>
        
      </Box>

      {/* RECENT ACTIVITY */}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Recent Tasks
      </Typography>

      {stats.recentTasks.length === 0 ? (
        <Typography color="text.secondary">
          You haven&apos;t posted any tasks yet.
        </Typography>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          {stats.recentTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {task.description?.slice(0, 80) || "No description"}...
                  </Typography>
                  <Chip
                    label={task.status}
                    color={
                      task.status === "completed"
                        ? "success"
                        : task.status === "assigned"
                        ? "primary"
                        : "default"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
