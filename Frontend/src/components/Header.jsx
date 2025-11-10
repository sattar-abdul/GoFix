// src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Build } from "@mui/icons-material";
import "./LandingPage.css";
import { useUserAuth } from "../contexts/UserAuthContext";
import { useProviderAuth } from "../contexts/ProviderAuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout: userLogout } = useUserAuth();
  const { provider, logout: providerLogout } = useProviderAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!(user || provider);

  const handleLogout = async () => {
    try {
      if (user) await userLogout();
      if (provider) await providerLogout();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AppBar
      position="fixed"
      className="header"
      sx={{
        backgroundColor: "primary.main",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href={isLoggedIn ? "/" : "/"}
          >
            <Typography
              variant="h6"
              className="logo"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Build className="logo-icon" />
              GoFix
            </Typography>
          </a>
        </Box>

        {/* Navigation Links */}
        <Box
          className="nav-links"
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 2,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Button color="inherit" href="#services">
            Services
          </Button>
          <Button color="inherit" href="#working">
            How it Works
          </Button>
          <Button color="inherit" href="#features">
            Features
          </Button>
        </Box>

        {/* Auth Buttons */}
        <Box className="auth-buttons" sx={{ display: "flex", gap: 1 }}>
          {!isLoggedIn ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                className="login-btn"
                href="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className="signup-btn"
                href="/register"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
