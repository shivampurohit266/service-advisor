const express = require("express");
const router = express.Router();
const vehicleController = require("../../controllers/frontend/vehicleController");
const token = require("../../common/token");

/* ----------Add New Vehicle------------ */
router.post(
  "/addVehicle",
  token.authorisedUser,
  vehicleController.addNewVehicle
);
router.get(
  "/getAllVehicleList",
  token.authorisedUser,
  vehicleController.getAllVehicleList
);
router.put(
  "/updateVehicleDetails",
  token.authorisedUser,
  vehicleController.updateVehicleDetails
);
router.post("/delete", token.authorisedUser, vehicleController.deleteVehicle);
router.post(
  "/updateStatus",
  token.authorisedUser,
  vehicleController.updateStatus
);
router.post(
  "/bulk-add",
  token.authorisedUser,
  vehicleController.bulkVehicleAdd
);
module.exports = router;
