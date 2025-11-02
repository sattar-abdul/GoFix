import { Navigate } from "react-router-dom";
import { useProviderAuth } from "../contexts/ProviderAuthContext.jsx";

const ProtectedProviderRoute = ({ children }) => {
  const { provider } = useProviderAuth();

  if (!provider) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedProviderRoute;
