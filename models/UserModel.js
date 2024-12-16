const mongoose = require("mongoose");
const bcrypt = require("bcrypt");  // For password hashing

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,  // Username must be unique
    trim: true,  // Removes extra spaces
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
    minlength : [6, "Password must be at least 6 characters"],  // Minimum password length
  },
  role: {
    type: String,
    enum: ["Admin", "Supervisor", "Event Manager", "Client"], // Roles can be limited to this
    required: [true, "Your role is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the user who created this account
  },
  // createdAt: {
  //   type: Date,
  //   default: new Date(),
  // },
}, {timestamps: true}); // Automatically adds createdAt and updatedAt fields

userSchema.index({ role: 1 });

// // HASH PASSWORD method
// userSchema.pre("save", async function () {
//   this.password = await bcrypt.hash(this.password, 12);
// });

// // Create a method to compare passwords (used for login)
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Creating the User model
const User = mongoose.model("User", userSchema);

// Exporting the User model
module.exports = User;
