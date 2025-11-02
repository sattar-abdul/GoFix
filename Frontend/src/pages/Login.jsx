import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext.jsx";
import { useProviderAuth } from "../contexts/ProviderAuthContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { login: userLogin } = useUserAuth();
  const { login: providerLogin } = useProviderAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
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
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <>
      <Header />

      <Container maxWidth="sm" sx={{ mt: 20, mb: 10 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
          <Button type="submit" variant="contained">
            Login
          </Button>
          <Button onClick={() => navigate("/register")}>
            Create an Account
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Login;
