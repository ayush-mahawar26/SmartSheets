const zod = require("zod");
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user_model.js");

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

userRoute.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  console.log(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const existingUser = await User.findOne({
    useremail: req.body.useremail,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    useremail: req.body.useremail,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
      email: req.body.useremail,
    },
    process.env.JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

userRoute.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  // console.log(req.body)
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    useremail: req.body.useremail,
    password: req.body.password,
  });

  if (user) {
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
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});

module.exports = {
  userRoute,
};
