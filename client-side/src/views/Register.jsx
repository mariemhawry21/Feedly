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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("First Name:", firstname);
    console.log("Last Name:", lastname);
    console.log("Email:", email);
    console.log("Password:", password);
    setError(null);
    setLoading(true);

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
            />
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
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
            <img
              src={img}
              alt="illustration"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Register;
