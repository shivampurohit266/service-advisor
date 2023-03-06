const express = require("express");
const router = express.Router();
const labourController = require("../../controllers/frontend/labourController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* ----------get all Standard routes------------ */
router.get("/getAllStdRate", token.authorisedUser, labourController.getAllStandardRate);

/* ----------add new standard rate routes------------ */
router.post("/addRate", token.authorisedUser, labourController.addNewrateStandard);

/* ----------Get single rate standard rate------------ */
router.post("/getSingleRate", token.authorisedUser, labourController.getSingleStandardRate);

/* ----------add new labour routes------------ */
router.post("/addLabour", token.authorisedUser, validation.createNewLabourValidations, labourController.createNewLabour)

/* ----------Update labour Details routes------------ */
router.put('/updateLabour', token.authorisedUser, validation.updateLabourValidations, labourController.updateLabourdetails);

/* ----------Get Labour List------------ */
router.get("/labourList", token.authorisedUser, labourController.getAllLabourList);

/* ----------Delete labour routes------------ */
router.post("/delete", token.authorisedUser, labourController.deleteLabour);
module.exports = router;
