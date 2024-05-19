const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../database/db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

//signup route
const signupBody = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

router.post("/signup", async function (req, res) {

  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ error: "Incorrect Inputs" });
  }

  //check if user already exist
  const username = req.body.username;

  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.json({ message: "user already exist" });
  }

  //create a new user
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
    return res.json({ error: error.message }); 
  }

  // creating an account on signup
  try {
    await Account.create({
      userId: userId,
      balance: 1 + Math.random() * 10000,
    });
  } catch (error) {
    return res.json({ error: error.message });  
  }

  const token = jwt.sign(
    {
      userId: userId,
    },
    JWT_SECRET
  );
  res.json({
    message: "User Created Successfully",
    token: token,
  });
});

// signin route
  
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }


  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
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

//route for updating the user

const updateBody = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(403).json({ message: "invalid input" });
  }
  const params = req.body;
  const userId = req.userId;

  console.log(userId);
  console.log(params);

  const update = await User.updateOne({_id: userId},{$set:params});
  res.json({
    message: "Updated successfully"
  });
});

// route to get user

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.findOne({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
