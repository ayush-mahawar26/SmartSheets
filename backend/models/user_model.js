const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  useremail: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, "Email must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },
  sheets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sheet",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
