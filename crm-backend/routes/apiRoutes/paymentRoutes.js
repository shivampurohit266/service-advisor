const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/frontend/paymentController");
const token = require("../../common/token");

router.post("/addPayment", token.authorisedUser, paymentController.addNewPaymentRecord);
module.exports = router;
