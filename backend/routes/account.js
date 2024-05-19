const { Router } = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../database/db");
const { default: mongoose } = require("mongoose");
const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userid = req.userId;
  const account = await Account.findOne({
    userid,
  });
  res.json({
    balance: account.balance,
  });
});

//route to transfer funds from one account to other account

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = mongoose.startSession();

  await session.startTransaction();
  const receiver = req.body.to;
  const amount = req.body.amount;

  // fetching the account from db

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: receiver }).session(
    session
  );
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  // Transferring balance to receiver and updating the database

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: receiver },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();

  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;
