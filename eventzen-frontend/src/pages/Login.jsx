import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      login(response.data.token);
      toast.success("Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login to Your Account
        </Typography>

        <Typography variant="body2" align="center" mb={3}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2", fontWeight: 500 }}>
            Register
          </Link>
        </Typography>

        <form onSubmit={handleLogin}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FiMail style={{ marginRight: 8, color: "#888" }} />
                ),
              }}
            />
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FiLock style={{ marginRight: 8, color: "#888" }} />
                ),
              }}
            />
          </Box>

          <Box mb={2} display="flex" justifyContent="flex-end">
            <Link to="/forgot-password" style={{ fontSize: 14, color: "#1976d2" }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ py: 1.5 }}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FiLogIn />
              )
            }
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
