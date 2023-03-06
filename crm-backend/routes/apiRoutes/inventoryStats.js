const express = require("express");
const router = express.Router();
const token = require("../../common/token");
const { getStats } = require("./../../controllers/frontend/inventoryStats");

router.get("/", token.authorise, getStats);

module.exports = router;
