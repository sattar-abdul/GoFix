// src/pages/provider/ProviderDashboard.jsx
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

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalCompleted: 0,
    totalBids: 0,
    recentTasks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await tasksAPI.getAssignedTasks();
      const userId = localStorage.getItem("userId");

      const matchId = (id) =>
        id === userId || id?._id === userId || id?.toString() === userId;

      const assigned = res.data.filter(
        (t) => matchId(t.selectedProviderId) && t.status === "assigned"
      );
      const completed = res.data.filter(
        (t) => matchId(t.selectedProviderId) && t.status === "completed"
      );

      const bidsCount = res.data.reduce((count, t) => {
        const hasBid = t.bids?.some((b) => matchId(b.providerId));
        return hasBid ? count + 1 : count;
      }, 0);

      const recentTasks = [...assigned, ...completed]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3);

      setStats({
        totalAssigned: assigned.length,
        totalCompleted: completed.length,
        totalBids: bidsCount,
        recentTasks,
      });
    } catch (err) {
      console.error("Error fetching provider stats:", err);
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
        Welcome, Provider 👨‍🔧
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Track your jobs, bids, and completed tasks all in one place.
      </Typography>

      {/* STATS CARDS */}
      <Grid
        container
        spacing={3}
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
              <Typography variant="h6">Assigned Tasks</Typography>
              <Typography variant="h4" color="primary">
                {stats.totalAssigned || 0}
              </Typography>
              <Chip label="Active" color="primary" sx={{ mt: 1 }} />
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
                {stats.totalCompleted || 0}
              </Typography>
              <Chip label="Done" color="success" sx={{ mt: 1 }} />
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
          onClick={() => navigate("/provider/browse")}
        >
          Browse Jobs
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => navigate("/provider/work")}
        >
          Accepted Work
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/provider/bids")}
        >
          My Bids
        </Button>
      </Box>

      {/* RECENT ACTIVITY */}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>

      {stats.recentTasks.length === 0 ? (
        <Typography color="text.secondary">
          No recent activity yet. Start bidding on jobs!
        </Typography>
      ) : (
        <Grid
          container
          spacing={3}
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
                    color={task.status === "completed" ? "success" : "primary"}
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
