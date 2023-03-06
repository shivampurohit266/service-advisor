const express = require("express");
const router = express.Router();
const googleCaptchaMail = require("../../controllers/frontend/googleCaptchaMail")
/* ----------Add New Fleet------------ */
router.post("/verifyMail", googleCaptchaMail.mailToVerifyCaptcha);
module.exports = router;
