const express = require("express");
const router = express.Router();
const {
  getReportsByCustomerdays
} = require("./../../controllers/frontend/reports");
const { authorisedUser } = require("../../common/token");

router.get("/", authorisedUser, getReportsByCustomerdays);

module.exports = router;
