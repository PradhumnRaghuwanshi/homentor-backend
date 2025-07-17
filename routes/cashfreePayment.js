const express = require("express");
const { createCashfreeOrder } = require("../controller/paymentController.js");

const router = express.Router();

router.post("/create-order", createCashfreeOrder);

module.exports = router