import React, { useState } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import img from "../assets/Group 5.png";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();

  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const validateInputs = () => {
    if (firstname.trim().length < 2 || firstname.trim().length > 30) {
      setError("First name must be between 2 and 30 characters");
      return false;
    }

    if (lastname.trim().length < 2 || lastname.trim().length > 30) {
      setError("Last name must be between 2 and 30 characters");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const isValid = validateInputs();
    if (!isValid) return;
    const data = {
      firstname,
      lastname,
      email,
      password,
    };
    const success = await register(data);
    if (success) {
      setLoading(false);
      navigate("/login");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="center"
        gap={4}
        maxWidth="1200px"
        width="100%"
      >
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <motion.form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
              maxWidth: isMobile ? "100%" : 400,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" fontWeight={600} textAlign="center">
              Register
            </Typography>

            <TextField
              label="First Name"
              variant="outlined"
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              required
              autoComplete="given-name"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
              autoComplete="family-name"
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              component={motion.button}
              whileTap={{ scale: 0.95 }}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {!loading && "Register"}
              {loading && (
                <motion.div
                  style={{
                    width: 20,
                    height: 20,
                    border: "3px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    margin: "0 auto",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              )}
            </Button>

            <Typography variant="body2" textAlign="center">
              Already have an account?
              <span
                style={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </Typography>
          </motion.form>
        </Box>

        {!isMobile && (
          <Box flex={1}>
            <motion.img
              src={img}
              alt="illustration"
              style={{ width: "100%", objectFit: "contain" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Register;
