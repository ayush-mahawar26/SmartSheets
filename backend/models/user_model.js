const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  useremail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
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
