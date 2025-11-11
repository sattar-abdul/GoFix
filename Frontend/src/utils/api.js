import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("userToken");
    const providerToken = localStorage.getItem("providerToken");
    const token = userToken || providerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("api/auth/login", credentials),
  register: (userData) => api.post("api/auth/register", userData),
};

// Tasks API
export const tasksAPI = {
  getTasks: () => api.get("/tasks"),
  getUserTasks: () => api.get("/tasks/my-tasks"),
  getAssignedTasks: () => api.get("/tasks/assigned/me"),
  createTask: (taskData) => {
    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("category", taskData.category);
    if (taskData.image) {
      formData.append("image", taskData.image);
    }

    return api.post("/tasks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  completeTask: (taskId) => api.put(`/tasks/${taskId}/complete`),
  rateProvider: (taskId, ratingData) =>
    api.post(`/tasks/${taskId}/rate`, ratingData),
  selectBid: ({ taskId, bidId }) =>
    api.put(`/tasks/${taskId}/select-bid/${bidId}`),
};

// Bids API
export const bidsAPI = {
  placeBid: (bidData) => api.post("/bids/place", bidData),
  selectBidByAdmin: (bidData) => api.put("/bids/select", bidData),
};

// Chat API
export const chatAPI = {
  getChat: (taskId) => api.get(`/chat/${taskId}`),
  sendMessage: (messageData) => api.post("/chat", messageData),
};

export default api;
