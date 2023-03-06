const express = require("express");
const router = express.Router();
const tierController = require("../../controllers/frontend/tierController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* ----------add new tier routes------------ */
router.post("/addTier", token.authorisedUser, validation.createTierValidation, tierController.createNewTier)

/* ----------Update tier Details routes------------ */
router.put('/updateTier', token.authorisedUser, validation.updateTierValidation, tierController.updateTierdetails);

/* ----------Get Tier List------------ */
router.get("/tierList", token.authorisedUser, tierController.getAllTierList);

/* ----------Delete tier routes------------ */
router.delete("/delete", token.authorisedUser, tierController.deleteTier);

/* ----------Update status tier routes------------ */
router.post("/updateStatus", token.authorisedUser, tierController.updateStatus);
module.exports = router;
