const express = require("express");
const router = express.Router();
const faqController = require("../../controllers/frontend/faqController");

router.get("/", faqController.getFaqList);

module.exports = router;