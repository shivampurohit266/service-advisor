const express = require("express");
const router = express.Router();
const userController = require("../../controllers/frontend/userController");
const token = require("../../common/token");

/* ----------Get All user------------ */
router.get("/", token.authorisedUser, userController.getAllUserList);
router.post("/delete", token.authorisedUser, userController.deleteUser);
router.post("/updateStatus", token.authorisedUser, userController.updateStatus);
router.get("/getProfile", token.authorisedUser, userController.getProfile);
router.get("/singleUser", token.authorisedUser, userController.getTechnicianData)
module.exports = router;
