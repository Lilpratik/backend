const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found, please contact support" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = createSecretToken(user._id, user.role);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false, // Consider setting this to true for better security
    });

    // Respond with success and token
    res.status(200).json({ message: "Login successful", success: true, token, role: user.role ,user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Function to create a new user (admin only)
module.exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: "User created successfully", success: true, user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
