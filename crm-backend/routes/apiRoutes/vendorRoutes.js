const express = require("express");
const router = express.Router();
const vendorController = require("../../controllers/frontend/vendorController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* ----------add new vendor routes------------ */
router.post("/addVendor", token.authorisedUser, validation.createVendorValidations, vendorController.createNewVendor)

/* ----------Update Vendor Details routes------------ */
router.put('/updateVendor', token.authorisedUser, validation.updateVendorValidations, vendorController.updateVendordetails);

/* ----------Get Vendor List------------ */
router.get("/vendorList", token.authorisedUser, vendorController.getAllVendorList);

/* ----------Delete vendor routes------------ */
router.post("/delete", token.authorisedUser, vendorController.deleteVendor);
module.exports = router;
