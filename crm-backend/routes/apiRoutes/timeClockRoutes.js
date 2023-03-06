const express = require("express");

const router = express.Router();
const timeClockController = require("../../controllers/frontend/timeClockController");
const token = require("../../common/token");
/**
 *
 */
router.post(
  "/addTimeLogs",
  token.authorisedUser,
  timeClockController.addTimeLogs
);
router.post(
  "/start-time-clock",
  token.authorisedUser,
  timeClockController.startTimer
);
router.patch(
  "/switch-task",
  token.authorisedUser,
  timeClockController.switchService
);
router.post(
  "/stop-time-clock",
  token.authorisedUser,
  timeClockController.stopTimer
);
router.get(
  "/get-time-log",
  token.authorisedUser,
  timeClockController.getTimeLogByTechnician
);
router.put(
  "/updateTimeLogs",
  token.authorisedUser,
  timeClockController.updateTimeLogOfTechnician
)
router.get(
  "/technicianTimeLogs",
  token.authorisedUser,
  timeClockController.getTimeLogOfTechnician
)
router.get(
  "/allTimeLogs",
  token.authorisedUser,
  timeClockController.getAllTimeLogs
)
/**
 *
 */
module.exports = router;
