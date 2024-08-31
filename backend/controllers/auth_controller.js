const zod = require("zod");
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user_model.js");
const {authMiddleWare} = require("../middleware/auth_middleware.js");

// Route for user
const userRoute = express.Router();

const signupBody = zod.object({
  useremail: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  useremail: zod.string().email(),
  password: zod.string(),
});

userRoute.get("/me", authMiddleWare, async (req, res) => {
  try{
    const user = await User.findById(req.userid);
    if(!user) {
      return res.status(411).json({
        message: "User not found"
      });
    }
    res.json(user);
  }
  catch(err){
    res.status(411).json({
      message: "Error while fetching user"
    });
  }
});

userRoute.post("/signup", async (req, res) => {
  try {
    const user = new User({
      useremail: req.body.useremail,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: req.body.useremail,
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(411).json({
        message: "Validation failed",
        errors: errors
      });
    }

    // Handle unique constraint error
    if (error.code === 11000) {
      return res.status(411).json({
        message: "Email already taken",
      });
    }

    // Handle other errors
    return res.status(500).json({
      message: "Server error",
    });
  }
});


userRoute.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Please provide a valid email and password.",
    });
  }

  const user = await User.findOne({
    useremail: req.body.useremail,
  });

  if (!user) {
    return res.status(411).json({
      message: "Email not available.",
    });
  }

  const isPasswordCorrect = user.password === req.body.password;
  if (!isPasswordCorrect) {
    return res.status(411).json({
      message: "Incorrect password.",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: req.body.useremail,
    },
    process.env.JWT_SECRET
  );

  res.json({
    token: token,
  });
});


module.exports = {
  userRoute,
};
