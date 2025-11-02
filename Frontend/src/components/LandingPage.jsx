// Components/LandingPage.js
import { useState } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Search,
  Build,
  Home,
  LocalShipping,
  Computer,
  Palette,
  School,
  CheckCircle,
  People,
  Assignment,
  Chat,
} from "@mui/icons-material";
import "./LandingPage.css";
import Footer from "./Footer";
import Header from "./Header";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    { icon: <Home />, title: "Home Services", color: "#FF6B6B" },
    { icon: <Build />, title: "Repairs", color: "#4ECDC4" },
    { icon: <Computer />, title: "Tech Support", color: "#96CEB4" },
    { icon: <Palette />, title: "Design", color: "#FFEAA7" },
    { icon: <LocalShipping />, title: "Delivery", color: "#DDA0DD" },
    { icon: <School />, title: "Tutoring", color: "#98D8C8" },
    { icon: <Build />, title: "Handyman", color: "#F7DC6F" },
  ];

  const features = [
    {
      icon: <People />,
      title: "Verified Professionals",
      description: "All service providers are background checked and verified",
    },
    {
      icon: <Assignment />,
      title: "Easy Task Posting",
      description: "Post your task in minutes and get multiple bids",
    },
    {
      icon: <Chat />,
      title: "Real-time Chat",
      description: "Communicate directly with service provider instantly, easily",
    },
    {
      icon: <CheckCircle />,
      title: "Secure Payment",
      description: "Safe and secure payment processing (Upcoming)",
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <div className="hero-content">
                <Typography variant="h2" className="hero-title">
                  Get Things Done with
                  <span className="highlight"> GoFix</span>
                </Typography>
                <Typography variant="h6" className="hero-subtitle">
                  Connect with skilled professionals for all your service needs.
                  Post tasks, get bids, and chat in real-time.
                </Typography>

                <div className="search-container">
                  <TextField
                    fullWidth
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton className="search-btn">
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="hero-stats">
                  <div className="stat">
                    <Typography variant="h4">🙂</Typography>
                    <Typography variant="body1">Happy Customers</Typography>
                  </div>
                  <div className="stat" style={{ paddingTop: "2.5rem" }}>
                    <Typography variant="h4">🧑‍🏭</Typography>
                    <Typography variant="body1">
                      Verified Professionals
                    </Typography>
                  </div>
                  <div className="stat">
                    <Typography variant="h4">⚡</Typography>
                    <Typography variant="body1">Blazing Fast</Typography>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="hero-image">
                <div className="floating-card card-1">
                  <Typography variant="body2">Task Posted</Typography>
                  <Typography variant="caption">
                    Plumbing repair needed
                  </Typography>
                </div>
                <div className="floating-card card-2">
                  <Typography variant="body2">3 Bids Received</Typography>
                  <Typography variant="caption">₹299</Typography>
                </div>
                <div className="floating-card card-3">
                  <Typography variant="body2">Chat Active</Typography>
                  <Typography variant="caption">
                    With John the Plumber
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title">
            Popular Services
          </Typography>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card className="service-card">
                  <CardContent className="service-content">
                    <div
                      className="service-icon"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.icon}
                    </div>
                    <Typography variant="h6" className="service-title">
                      {service.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title">
            How GoFix Works
          </Typography>
          <Grid
            container
            spacing={4}
            wrap="nowrap"
            sx={{ overflowX: "auto" }} // optional: scroll if too wide
          >
            <Grid item xs={12} md={4}>
              <div className="step">
                <div className="step-number">1</div>
                <Typography variant="h5">Post Your Task</Typography>
                <Typography variant="body1">
                  Describe what you need done and Upload the pic
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <div className="step">
                <div className="step-number">2</div>
                <Typography variant="h5">Get Bids</Typography>
                <Typography variant="body1">
                  Receive competitive bids from verified professionals
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <div className="step">
                <div className="step-number">3</div>
                <Typography variant="h5">Chat & Hire</Typography>
                <Typography variant="body1">
                  Chat in real-time and hire the best professional for your task
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" className="section-title" gutterBottom>
            Why Choose GoFix?
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <div className="feature-card" style={{ textAlign: "center" }}>
                  <div className="feature-icon">{feature.icon}</div>
                  <Typography variant="h6" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    {feature.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Testimonials Section Not added any testimonials*/}
      <section className="testimonials-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title">
            So, What are you waiting for...
          </Typography>
          
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <Typography variant="h3" className="cta-title">
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" className="cta-subtitle">
            Join thousands of satisfied customers and skilled professionals
          </Typography>
          <div className="cta-buttons">
            <Button
              variant="contained"
              size="large"
              className="cta-btn primary"
              href="/login"
            >
              Post a Task
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="cta-btn secondary"
              href="/register"
            >
              Become a Professional
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
