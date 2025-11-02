import { Container, Grid, Typography } from "@mui/material";
import { Build } from "@mui/icons-material";
import "./LandingPage.css";

const Footer = () => {
  return (
    <footer className="footer" >
      <Container maxWidth="lg">
        <Grid container spacing={4} >
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="footer-logo">
              <Build /> GoFix
            </Typography>
            <Typography variant="body2">
              Your trusted marketplace for all service needs
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6">Services</Typography>
            <div className="footer-links">
              <Typography variant="body2">Home Services</Typography>
              <Typography variant="body2">Repairs</Typography>
              <Typography variant="body2">Cleaning</Typography>
              <Typography variant="body2">Tech Support</Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6">Company</Typography>
            <div className="footer-links">
              <Typography variant="body2">About Us</Typography>
              <Typography variant="body2">How it Works</Typography>
              <Typography variant="body2">Careers</Typography>
              <Typography variant="body2">Contact</Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6">Support</Typography>
            <div className="footer-links">
              <Typography variant="body2">Help Center</Typography>
              <Typography variant="body2">Safety</Typography>
              <Typography variant="body2">Terms</Typography>
              <Typography variant="body2">Privacy</Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6">Connect</Typography>
            <div className="footer-links">
              <Typography variant="body2">Facebook</Typography>
              <Typography variant="body2">Twitter</Typography>
              <Typography variant="body2">Instagram</Typography>
              <Typography variant="body2">LinkedIn</Typography>
            </div>
          </Grid>
        </Grid>
        <div className="footer-bottom">
          <Typography variant="body2">
            © 2025 GoFix. All rights reserved.
          </Typography>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
