const express = require("express");
const router = express.Router();

const {
  createTransaction,
  calculateRate,
} = require("../controllers/transaction");

router.post("/add-rate", createTransaction);

router.post("/calculate-rate", calculateRate);

module.exports = router;
