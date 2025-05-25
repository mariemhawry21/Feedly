const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require("../controllers/user.controller");
router.get("/register", async (req, res) => {
  res.json({
    data: "working",
  });
});
router.post("/register", registerUser); // Register new user
router.post("/login", loginUser); // Login an existing user
router.get("/:id", getUserProfile); // Login an existing user
router.put("/:id", updateUserProfile); // Login an existing user

module.exports = router;
