import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext.jsx";
import { useProviderAuth } from "../contexts/ProviderAuthContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const roles = [
  { label: "I need a service", value: "user" },
  { label: "I provide a service", value: "provider" },
];

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    city: "",
    category: "",
  });

  const navigate = useNavigate();
  const { login: userLogin } = useUserAuth();
  const { login: providerLogin } = useProviderAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };

      // Remove provider-specific fields if role is user
      if (form.role === "user") {
        delete payload.phone;
        delete payload.city;
        delete payload.category;
      }

      const { data } = await axios.post(
        `${API_BASE_URL}/auth/register`,
        payload
      );

      // login based on role
      if (data.role === "user") {
        userLogin(data.token, {
          id: data.id,
          name: data.name,
          email: data.email,
        });
        navigate("/user/dashboard");
      } else if (data.role === "provider") {
        providerLogin(data.token, {
          id: data.id,
          name: data.name,
          email: data.email,
        });
        navigate("/provider/dashboard");
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Header />

      <Container maxWidth="sm" sx={{ mt: 12, mb: 10 }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Typography>Select Role:</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {roles.map((r) => (
              <Card
                key={r.value}
                sx={{
                  flex: 1,
                  border:
                    form.role === r.value ? "2px solid #FF8E53" : "1px solid gray",
                  cursor: "pointer",
                }}
                onClick={() => setForm({ ...form, role: r.value })}
              >
                <CardContent>{r.label}</CardContent>
              </Card>
            ))}
          </Box>

          {form.role === "provider" && (
            <>
              <TextField
                label="Phone Number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <TextField
                label="City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <TextField
                label="Service Category"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </>
          )}

          <Button type="submit" variant="contained">
            Register
          </Button>
          <Button onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Register;
