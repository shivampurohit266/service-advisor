const express = require("express");
const router = express.Router();
const roleTypeController = require("../../controllers/frontend/roleTypeController");
const token = require("../../common/token");
// eslint-disable-next-line

router.get("/getAllRoles",token.authorisedUser,roleTypeController.getUserAllRole);
module.exports = router;
