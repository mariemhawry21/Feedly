const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./src/config/db");
const cors = require("cors");
const postRoutes = require("./src/routes/post.routes");
const userRoutes = require("./src/routes/user.routes");
const uploadRoutes = require("./src/routes/upload.routes");

const app = express();
const PORT = process.env.PORT || 5000;

const httpStatusText = require("./src/utils/httpStatusText");

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://feedly-two.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Api is working");
});

/* * * Routes * * */
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/image", uploadRoutes);

// Global error handler
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    error: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
