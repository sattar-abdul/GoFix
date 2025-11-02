import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ProviderAuthContext = createContext();

// Provider Component
export const ProviderAuthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (token) setProvider(token);
  }, []);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem("providerToken", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
    setProvider(token);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setProvider(null);
  };

  return (
    <ProviderAuthContext.Provider value={{ provider, login, logout }}>
      {children}
    </ProviderAuthContext.Provider>
  );
};

// Custom Hook for easier usage
export const useProviderAuth = () => {
  return useContext(ProviderAuthContext);
};
