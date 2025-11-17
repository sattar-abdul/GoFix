// src/layout/ProviderLayout.jsx

import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useProviderAuth } from "../contexts/ProviderAuthContext.jsx";

const drawerWidth = 240;

export default function ProviderLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useProviderAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/provider/dashboard" },
    { text: "Browse Jobs", path: "/provider/browse" },
    { text: "My Bids", path: "/provider/bids" },
    { text: "Accepted Work", path: "/provider/work" },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <ListItem onClick={logout} sx={{ cursor: 'pointer' }}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: drawerWidth },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Service Provider Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
