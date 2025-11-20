// src/pages/user/PostServiceRequest.jsx

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import { tasksAPI } from "../../utils/api.js";
import axios from "axios";

const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Gardening",
  "Painting",
  "Carpentry",
  "Appliance Repair",
  "Other",
];

export default function PostServiceRequest() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    state: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const taskData = {
        ...formData,
        image: image,
      };

      await tasksAPI.createTask(taskData);
      setMessage("Service Request Submitted Successfully! ✅");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        city: "",
        state: "",
      });
      setImage(null);
      setAiSuggested(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    if (!image) {
      alert("Please upload an image to use AI.");
      return;
    }

    setAiLoading(true);
    setAiSuggested(false);

    try {
      const formDataAI = new FormData();
      formDataAI.append("image", image);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/analyze-image`,
        formDataAI,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { title, description, category } = response.data;

      setFormData((prev) => ({
        ...prev,
        title,
        description,
        category,
      }));

      setAiSuggested(true);
    } catch (err) {
      console.error("AI Error:", err);
      setAiSuggested(false);
    }

    setAiLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Post a Service Request
        </Typography>

        {message && (
          <Alert
            severity={message.includes("Successfully") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* IMAGE UPLOAD + AI BUTTON */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Upload Image (Optional)
              </Typography>

              {/* Drag & Drop Upload */}
              <Box
                sx={{
                  border: "2px dashed #a5a2a2ff",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  mb: 2,
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {!image ? (
                  <Typography variant="body1" color="text.secondary">
                    Click to upload or drag an image here
                  </Typography>
                ) : (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                )}

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setAiSuggested(false); // reset AI indicator
                    }
                  }}
                />
              </Box>

              {/* Auto-Fill Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleRunAI}
                disabled={aiLoading}
              >
                {aiLoading ? "Analyzing..." : "Auto-fill using AI"}
              </Button>

              {aiSuggested && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  🤖 AI auto-filled the fields based on the image!
                </Alert>
              )}
            </Box>

            {/* FORM FIELDS */}

            <TextField
              label={
                <Box display="flex" alignItems="center">
                  Title
                  {aiSuggested && (
                    <Chip label="AI" color="info" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              fullWidth
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <TextField
              label={
                <Box display="flex" alignItems="center">
                  Description
                  {aiSuggested && (
                    <Chip label="AI" color="info" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              multiline
              rows={3}
              fullWidth
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <TextField
              select
              label={
                <Box display="flex" alignItems="center">
                  Category
                  {aiSuggested && (
                    <Chip label="AI" color="info" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              fullWidth
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </TextField>

            <TextField
              label="City"
              fullWidth
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />

            <TextField
              label="State"
              fullWidth
              required
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
