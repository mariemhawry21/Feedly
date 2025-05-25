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
    const updates = {};

    // Only update fields that are provided in the request
    if (req.body.avatar) updates.avatar = req.body.avatar;
    if (req.body.firstname) updates.firstname = req.body.firstname;
    if (req.body.lastname) updates.lastname = req.body.lastname;
    if (req.body.email) updates.email = req.body.email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // runValidators ensures updated data follows schema rules
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { registerUser, loginUser, updateUserProfile, getUserProfile };
