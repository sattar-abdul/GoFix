import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { UserAuthProvider } from "./contexts/UserAuthContext.jsx";
import { ProviderAuthProvider } from "./contexts/ProviderAuthContext.jsx";

// Components
import ProtectedUserRoute from "./components/ProtectedUserRoute.jsx";
import ProtectedProviderRoute from "./components/ProtectedProviderRoute.jsx";

// Layouts
import UserLayout from "./layout/UserLayout.jsx";
import ProviderLayout from "./layout/ProviderLayout.jsx";

// User Pages
import Dashboard from "./pages/user/Dashboard.jsx";
import PostServiceRequest from "./pages/user/PostServiceRequest.jsx";
import Requests from "./pages/user/Requests.jsx";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard.jsx";
import BrowseJobs from "./pages/provider/BrowseJobs.jsx";
import MyBids from "./pages/provider/MyBids.jsx";
import AcceptedWork from "./pages/provider/AcceptedWork.jsx";

// Auth Pages (your real login/register pages)
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChatPage from "./pages/ChatPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <UserAuthProvider>
        <ProviderAuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<ChatPage />} />

            {/* User Dashboard Routes */}
            <Route
              path="/user/*"
              element={
                <ProtectedUserRoute>
                  <UserLayout /> {/* must contain <Outlet /> */}
                </ProtectedUserRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="post-request" element={<PostServiceRequest />} />
              <Route path="requests" element={<Requests />} />
            </Route>

            {/* Provider Dashboard Routes */}
            <Route
              path="/provider/*"
              element={
                <ProtectedProviderRoute>
                  <ProviderLayout /> {/* must contain <Outlet /> */}
                </ProtectedProviderRoute>
              }
            >
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="browse" element={<BrowseJobs />} />
              <Route path="bids" element={<MyBids />} />
              <Route path="work" element={<AcceptedWork />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<h2>404 Page Not Found</h2>} />
          </Routes>
        </ProviderAuthProvider>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App;
