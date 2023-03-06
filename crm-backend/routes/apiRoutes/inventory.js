const express = require("express");
const router = express.Router();
const token = require("../../common/token");

router.use("/part", token.authorise, require("./part"));

module.exports = router;
