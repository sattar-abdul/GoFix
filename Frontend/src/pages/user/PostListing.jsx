import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { postTask } from "../../api/tasks";
import { useNavigate } from "react-router-dom";

const categories = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Cleaning",
  "Tutoring",
  "Salon",
];

const PostListing = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () =>
    form.title.trim() && form.description.trim() && form.category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate())
      return alert("Please fill title, description and category.");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("category", form.category);
    if (image) fd.append("image", image);

    try {
      setLoading(true);
      await postTask(fd);
      alert("Task posted successfully");
      navigate("/user/my-listings");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Post a Problem / Task
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          select
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Posting..." : "Post Task"}
        </Button>
      </Box>
    </Container>
  );
};

export default PostListing;
