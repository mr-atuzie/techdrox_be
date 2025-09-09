const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      default: "USD", // for now just USD, can expand later
    },
    transactionType: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    rate: {
      type: Number,
      required: true, // e.g. 2000 (for 1 USD = ₦2000)
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
