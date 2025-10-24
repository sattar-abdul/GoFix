import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) return <Navigate to="/login" />;
  if (role && auth.role !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
