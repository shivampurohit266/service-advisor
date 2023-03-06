const express = require("express");
const router = express.Router();
const activityController = require("../../controllers/frontend/activityController");
const token = require("../../common/token");

/* add new activity */
router.post("/addActivity", token.authorisedUser, activityController.createNewActivity)

/* get all activity */
router.get("/getActivity", token.authorisedUser, activityController.getAllActivity)

module.exports = router;
