const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/frontend/customerController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");
/* ----------Get All user------------ */
router.post(
  "/createCustomer",
  validation.createCustomerValidation,
  token.authorisedUser,
  customerController.createCustomer
);
router.get(
  "/getAllCustomerList",
  token.authorisedUser,
  customerController.getAllCustomerList
);
router.post("/delete", token.authorisedUser, customerController.deleteCustomer);
router.post(
  "/updateStatus",
  token.authorisedUser,
  customerController.updateStatus
);
router.put(
  "/updateCustomerdetails",
  token.authorisedUser,
  customerController.updateCustomerdetails
);
router.post(
  "/bulk-add",
  token.authorisedUser,
  customerController.bulkCustomerAdd
);

module.exports = router;
