const express = require("express");
const router = express.Router();
const inspectionController = require("../../controllers/frontend/inspectionController");
const msgTempController = require("../../controllers/frontend/messageTempController");
const token = require("../../common/token");
var multer = require('multer')
const path = require("path");
const { storageFile } = require("../../common/images");

const upload = multer({ storage: storageFile });

/* ----------Add new inspection------------ */
router.post("/addInspection", token.authorisedUser, inspectionController.creteNewInspection);

/* get all inspection */
router.get("/inspectionList", token.authorisedUser, inspectionController.getInspectionData);

/* add inspection as template */
router.post("/inspectionTemplate", token.authorisedUser, inspectionController.inspectionTemplate);

/* add new message template */
router.post('/messageTemplate', token.authorisedUser, msgTempController.addMessageTemplate)

/* get all msg templates Search*/
router.get('/messageTemplateListSearch', token.authorisedUser, msgTempController.getAllMsgTemplateListSearch)

/* get all msg templates */
router.get('/messageTemplateList', token.authorisedUser, msgTempController.getAllMsgTemplateList)

/* update message template */
router.put("/messageTemplateUpdate", token.authorisedUser, msgTempController.updateMessageTemplate)

/* delete message template */
router.delete("/messageTemplateDelete", token.authorisedUser, msgTempController.deleteMessageTemplate)

/* send inspection details mail */
router.post("/sendInspectionDetails", token.authorisedUser, msgTempController.sendMailToCustomer)

/* generate PDF Document */
router.post("/generatePdfDoc", token.authorisedUser, inspectionController.generatePdfDoc)

/* inspection Image Upload on s3 */
router.post("/imgUpload", token.authorisedUser, upload.array('file', 12), inspectionController.imageUpload)
module.exports = router;
