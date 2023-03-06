const express = require("express");
const router = express.Router();
const matrixController = require("../../controllers/frontend/matrixController");
const token = require("../../common/token");
const validation = require("../../common/apiValidation");

/* ----------get all matrix------------ */
router.get("/getAllMatrix", token.authorisedUser, matrixController.getAllMatrix);

/*Add new matrix*/
router.post("/addMatrix", token.authorisedUser, validation.createNewMatrixValidation, matrixController.createpriceMatrix);

/*Update matrix details*/
router.put("/updateMatrix", token.authorisedUser, validation.UpdateMatrixValidation, matrixController.updatepriceMatrix);

/*Delete tier routes*/
router.delete("/delete", token.authorisedUser, matrixController.deleteMatrix);
module.exports = router;
