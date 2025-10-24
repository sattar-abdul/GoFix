// src/pages/user/Dashboard.jsx

import React from "react";
import { Typography, Card, CardContent } from "@mui/material";

export default function Dashboard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Welcome to User Dashboard 👋
        </Typography>
        <Typography variant="body1">
          You can post service requests and manage providers from here.
        </Typography>
      </CardContent>
    </Card>
  );
}
