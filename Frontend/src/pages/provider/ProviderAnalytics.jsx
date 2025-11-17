import { useEffect, useState } from "react";
import { Box, Typography, Card, Grid, CircularProgress } from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

import { tasksAPI } from "../../utils/api";

export default function ProviderAnalytics() {
  const [assigned, setAssigned] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await tasksAPI.getAssignedTasks();
      const all = response.data;

      setAssigned(all.filter((t) => t.status === "assigned"));
      setCompleted(all.filter((t) => t.status === "completed"));
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // 1. Pie Chart: Assigned vs Completed
  // ------------------------------
  const pieData = [
    { name: "Assigned", value: assigned.length },
    { name: "Completed", value: completed.length },
  ];

  const PIE_COLORS = ["#1976d2", "#4caf50"];

  // ------------------------------
  // 2. Bar Chart: Completed Tasks Per Month
  // ------------------------------
  const getThreeMonthData = (tasks) => {
    const now = new Date();

    // Get previous, current, next months
    const months = [
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1),
    ];

    const labels = months.map((d) =>
      d.toLocaleString("default", { month: "short" })
    );

    // Initialize counts = 0
    const data = labels.map((label) => ({ name: label, completed: 0 }));

    // Fill real data
    tasks.forEach((task) => {
      if (!task.completedAt) return;

      const date = new Date(task.completedAt);
      const monthLabel = date.toLocaleString("default", { month: "short" });

      const idx = labels.indexOf(monthLabel);
      if (idx !== -1) {
        data[idx].completed += 1;
      }
    });

    return data;
  };

  const barData = getThreeMonthData(completed);

  // ------------------------------
  // 3. Line Chart: Rating Trend Over Time
  // ------------------------------
  const getRatingHistory = (tasks) =>
    tasks
      .filter((t) => t.rating?.score && t.rating?.ratedAt)
      .map((t) => {
        const date = new Date(t.rating.ratedAt);
        return {
          date: date.toLocaleString("default", {
            month: "short",
            day: "numeric",
          }),
          score: t.rating.score,
        };
      });

  const ratingHistory = getRatingHistory(completed);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Provider Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task Overview
            </Typography>

            <PieChart width={300} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <Typography align="center" sx={{ mt: 1 }}>
              Assigned: {assigned.length} | Completed: {completed.length}
            </Typography>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Completed Jobs
            </Typography>

            <BarChart width={450} height={280} data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="completed" fill="#bb00ffff" />
            </BarChart>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item  md={4}>
          <Card sx={{ p: 2}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Rating Trend
            </Typography>

            <LineChart width={450} height={280} data={ratingHistory}>
              <XAxis dataKey="date" />
              <YAxis domain={[1, 6]} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#e91e63"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>

            {ratingHistory.length > 0 ? (
              <Typography align="center" sx={{ mt: 1 }}>
                Latest Rating: {ratingHistory[ratingHistory.length - 1].score}{" "}
                ⭐
              </Typography>
            ) : (
              <Typography align="center" sx={{ mt: 1 }}>
                No ratings yet
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
