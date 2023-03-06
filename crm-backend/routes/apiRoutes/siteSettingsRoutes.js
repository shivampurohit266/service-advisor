const express = require("express");
const router = express.Router();
const siteSettingController = require("../../controllers/frontend/siteSetting");

router.get("/", siteSettingController.getSiteSettings);

module.exports = router;
