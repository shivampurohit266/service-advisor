const express = require("express");
const router = express.Router();
const homePageController = require("../../controllers/frontend/homePage");

router.get("/home", homePageController.getHomePage);

module.exports = router;
