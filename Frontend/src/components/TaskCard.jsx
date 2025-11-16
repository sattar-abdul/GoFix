// src/components/TaskCard.jsx
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DefaultImg from "../assets/default-service.jpg";

export default function TaskCard({
  task,
  getStatusColor,
  openBidsDialog,
  openRatingDialog,
}) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        wordWrap: "break-word",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            size="small"
          />
        </Box>

        <Chip
          label={task.category}
          color="primary"
          size="small"
          sx={{ mb: 1 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          📍 {task.city}, {task.state}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {task.description}
        </Typography>

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

        <Typography variant="caption" color="text.secondary" display="block">
          Bids: {task.bids?.length || 0}
        </Typography>

        {task.selectedProviderId && (
          <Typography
            variant="caption"
            color="success.main"
            display="block"
            sx={{ wordBreak: "break-word" }}
          >
            Provider Selected: {task.selectedProviderId?.name || "Unknown"}
            {task.selectedProviderId?.averageRating && (
              <span> (⭐ {task.selectedProviderId.averageRating})</span>
            )}
          </Typography>
        )}

        {task.status === "completed" && task.rating && (
          <Typography variant="caption" color="primary.main" display="block">
            ✅ Task completed on{" "}
            {new Date(task.completedAt).toLocaleDateString()}
            {task.rating?.score && (
              <span> - Rated: ⭐ {task.rating.score}/5</span>
            )}
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
        {task.status === "open" && task.bids?.length > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => openBidsDialog(task)}
          >
            View Bids ({task.bids.length})
          </Button>
        )}

        {task.status === "completed" && !task.rating?.score && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => openRatingDialog(task)}
          >
            Rate Provider
          </Button>
        )}

        {task.selectedProviderId && task.status !== "open" && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/user/chat/${task._id}`)}
          >
            Chat with Provider
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
