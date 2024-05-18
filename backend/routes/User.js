const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../database/db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

//signup route
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async function (req, res) {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ error: "email already exist / Incorrect Inputs" });
  }
  const existingUser = await User.findOne(req.body.username);
  if (existingUser) {
    return res.json({ message: "user already exist" });
  }
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userid = newUser._id;

  const token = jwt.sign(
    {
      userid,
    },
    JWT_SECRET
  );
  res.json({
    message: "User Created Successfully",
    token: token,
  });
});

// route for signin

const signinBody = zod.object({
  username: zod.string().email,
  password: zod.string(),
});

router.post("/signin", async function (req, res) {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "wrong inputs",
    });
  }
  const user = await User.findOne(req.body.username);
  if (user) {
    const token = jwt.sign(
      {
        userid: user._id,
      },
      JWT_SECRET
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

module.exports = router;
