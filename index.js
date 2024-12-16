const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const authRoutes = require('./routes/AuthRoute');
const User = require('./models/UserModel');
const eventRoutes = require('./routes/EventRoute');
const taskRoutes = require('./routes/TaskRoute');
require('dotenv').config();

const { MONGO_URL, PORT, ADMIN_PASSWORD } = process.env;

// Middleware to handle CORS and JSON parsing
app.use(
  cors({
    origin: ["http://localhost:5000"],  // Allowing requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true,  // Enabling credentials
  })
);

app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB is connected successfully");
    createAdmin(); // Ensure admin is created after successful MongoDB connection
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to create an initial admin
async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10); // Hash password
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'Admin',
      });
      await admin.save();
      console.log('Initial Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating initial Admin:', error);
  }
}

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
