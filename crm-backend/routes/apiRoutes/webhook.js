const express = require("express");
const router = express.Router();
const {
  subscriptionUpdated
} = require("./../../controllers/frontend/webhooks");

router.post("/subscription-updated", subscriptionUpdated);

module.exports = router;
