const express = require("express");
const router = express.Router();
const { authorisedUser } = require("./../../common/token");
const {
  getOverview,
  customerSales
} = require("./../../controllers/frontend/dashboard");
const { appointmentList } = require("./../../controllers/frontend/appointment");

//
router.get("/overview", authorisedUser, getOverview);
router.get("/customers-sales", authorisedUser, customerSales);
router.get("/appointments", authorisedUser, appointmentList);

//
module.exports = router;
