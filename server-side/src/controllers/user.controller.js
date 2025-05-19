const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = new User({ firstname, lastname, email, password });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // Exclude password
      .populate("posts");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("user profile form back", user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile };
