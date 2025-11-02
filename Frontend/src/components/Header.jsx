import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Build } from "@mui/icons-material";
import "./LandingPage.css";

import { useUserAuth } from "../contexts/UserAuthContext";
import { useProviderAuth } from "../contexts/ProviderAuthContext";

const Header = () => {
  const { user, logout: userLogout } = useUserAuth();
  const { provider, logout: providerLogout } = useProviderAuth();
  const isLoggedIn = !!(user || provider);

  return (
    <AppBar position="fixed" className="header">
      <Toolbar>
        <Typography variant="h6" className="logo">
          <Build className="logo-icon" />
          GoFix
        </Typography>
        <div className="nav-links">
          <Button color="inherit">Services</Button>
          <Button color="inherit">How it Works</Button>
          <Button color="inherit">About</Button>
        </div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" className="login-btn" href="/login">
                Login
              </Button>
              <Button
                variant="contained"
                className="signup-btn"
                href="/register"
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined" className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
