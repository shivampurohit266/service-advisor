const express = require("express");
const router = express.Router();
const { authorisedUser } = require("./../../common/token");
const {
  SubscribeMembershipValidations
} = require("./../../common/apiValidation");
const {
  subscribe,
  getPlansList
} = require("./../../controllers/frontend/membership");
/*
/* 
 */
router.post(
  "/subscribe",
  SubscribeMembershipValidations,
  authorisedUser,
  subscribe
);
/*
/* 
 */
router.get("/list", getPlansList);
module.exports = router;
