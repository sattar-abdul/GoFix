import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext.jsx";

const ProtectedUserRoute = ({ children }) => {
  const { user } = useUserAuth();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedUserRoute;
