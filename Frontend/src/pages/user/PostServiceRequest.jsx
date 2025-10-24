// src/pages/user/PostServiceRequest.jsx

import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import { tasksAPI } from "../../utils/api.js";

const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Gardening",
  "Painting",
  "Carpentry",
  "Appliance Repair",
  "Other"
];

export default function PostServiceRequest() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setFormData({ title: "", description: "", category: "" });
      setImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Post a Service Request
        </Typography>

        {message && (
          <Alert severity={message.includes("Successfully") ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Service Title"
              fullWidth
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <TextField
              label="Description"
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
              label="Category"
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

            <Box>
              <Typography variant="body2" gutterBottom>
                Upload Image (Optional)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 16 }}
              />
            </Box>

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
