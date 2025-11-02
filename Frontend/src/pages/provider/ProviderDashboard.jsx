import { Typography, Card, CardContent } from "@mui/material";

export default function ProviderDashboard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Welcome Provider! 👨‍🔧
        </Typography>
        <Typography variant="body1">
          You can browse service requests and bid on jobs.
        </Typography>
      </CardContent>
    </Card>
  );
}
