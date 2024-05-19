const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User,Account } = require("../database/db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

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
    return res.status(411).json({ error: "Incorrect Inputs" });
  }

  //check if user already exist

  const existingUser = await User.findOne(req.body.username);
  if (existingUser) {
    return res.json({ message: "user already exist" });
  }

  //create a new user

  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = newUser._id;

  // creating an account on signup
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
})

  const token = jwt.sign(
    {
      userId,
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
  username: zod.string().email(),
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
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put('/',authMiddleware,async (req, res) => {
  const {success} = updateBody.safeParse(req.body);
  if (!success) {
      return res.status(403).json({message:"invalid input"});
  }
  const update = await User.updateOne(req.body,{
    id:req.userId
  }) 
  res.json({
    message: "Updated successfully",
  });
});

// route to get user 

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})

module.exports = router;
