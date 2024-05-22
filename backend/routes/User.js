const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../database/db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

// Signup route
const signupBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

router.post("/signup", async function (req, res) {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ error: "Incorrect Inputs" });
  }

  // Check if user already exists
  const username = req.body.username;
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create a new user
  let newUser = null;
  let userId = null;
  try {
    newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    userId = newUser._id;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  // Creating an account on signup
  try {
    await Account.create({
      userId: userId,
      balance: 1 + Math.random() * 10000,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  const token = jwt.sign(
    { userId: userId },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expiration time can be adjusted as needed
  );
  res.status(201).json({
    message: "User Created Successfully",
    token: token,
  });
});

// Signin route
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Route to update the user
const updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const params = req.body;
  const userId = req.userId;

  try {
    await User.updateOne({ _id: userId }, { $set: params });
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get user
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      { firstname: { $regex: filter, $options: "i" } },
      { lastname: { $regex: filter, $options: "i" } },
    ],
  });
  res.json({
    users: users.map(user => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  });
});

// Route to get authenticated user details
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("firstname lastname");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const account = await Account.findOne({ userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const name = `${user.firstname} ${user.lastname}`;
    res.status(200).json({
      balance: account.balance,
      name: name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
