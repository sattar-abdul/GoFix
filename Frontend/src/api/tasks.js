// frontend/src/api/tasks.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const postTask = (formData) =>
  axios.post(`${API_BASE}/tasks`, formData, {
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserTasks = () =>
  axios.get(`${API_BASE}/tasks/user`, getAuthHeaders());

export const deleteTask = (taskId) =>
  axios.delete(`${API_BASE}/tasks/${taskId}`, getAuthHeaders());

export const getTaskById = (id) =>
  axios.get(`${API_BASE}/tasks/${id}`, getAuthHeaders());
