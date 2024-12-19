const User = require("../models/user.models");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: 'error', message: "User not found, please contact support" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: "Invalid password" });
    }

    // Generate token
    const token = createSecretToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,  // Set to true for better security
      secure: process.env.NODE_ENV === "production",  // Only send over HTTPS in production
      maxAge: 3600000, // 1 hour expiration
    });

    res.status(200).json({
      status: 'success',
      message: "Login successful",
      token,
      role: user.role,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: "Internal server error" });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: "Internal server error" });
  }
};
