const express = require("express");
const router = express.Router();
const {
  add,
  getList,
  deletePart,
  update
} = require("./../../controllers/frontend/parts");
//
router.get("/", getList);
router.post("/", add);
router.delete("/", deletePart);
router.put("/", update);

//
module.exports = router;
