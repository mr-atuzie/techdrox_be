const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

const createTransaction = asyncHandler(async (req, res) => {
  const { currency, transactionType, rate } = req.body;

  if (!currency || !transactionType || !rate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Calculation (amount * rate)
  //   const totalInNaira = amount * rate;

  const transaction = await Transaction.create({
    currency,
    transactionType,
    rate,
  });

  res.status(201).json({
    message: `${transactionType.toUpperCase()} transaction created`,
    transaction,
  });
});

const calculateRate = asyncHandler(async (req, res) => {
  const { amount, currency, transactionType } = req.body;

  if (!amount || !currency || !transactionType) {
    return res
      .status(400)
      .json({ message: "Amount, currency, and transaction type are required" });
  }

  const rateDoc = await Transaction.findOne({ currency, transactionType });
  if (!rateDoc) {
    return res.status(404).json({ message: "Rate not set for this currency" });
  }

  const rate = rateDoc.rate;
  const convertedAmount = amount * rate;

  res.status(200).json({
    transactionType,
    currency,
    amount,
    rate,
    convertedAmount,
    message: "Rate calculated successfully",
  });
});

module.exports = { createTransaction, calculateRate };
