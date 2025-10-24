import React, { createContext, useContext, useState, useEffect } from "react";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUser(token);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);
    setUser(token);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// ✅ Custom hook
export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context)
    throw new Error("useUserAuth must be used inside UserAuthProvider");
  return context;
};
