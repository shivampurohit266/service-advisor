const express = require("express");
const router = express.Router();
const fleetController = require("../../controllers/frontend/fleetController");
const token = require("../../common/token");

/* ----------Add New Fleet------------ */
router.post("/addFleet", token.authorisedUser, fleetController.addNewFleet);

/* ----------Get Fleet List------------ */
router.get("/fleetList", token.authorisedUser, fleetController.getAllFleetList);

/* ----------Update Fleet Details------------ */
router.put('/updateFleet', token.authorisedUser, fleetController.updateFleetdetails);

/* ----------Delete Fleet------------ */
router.post("/delete", token.authorisedUser, fleetController.deleteFleet);

/* ----------Update Fleet Status------------ */
router.post("/updateStatus", token.authorisedUser, fleetController.updateStatus);

/* ----------Get Customer Fleet------------ */
router.get("/customerFleet", token.authorisedUser, fleetController.getFleetListForCustomer);
module.exports = router;
