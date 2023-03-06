const Label = require("../../models/label");

/* Get all saved Label */
const getAllLabelList = async (req, res) => {
   const { query, currentUser } = req;
   try {
      const isSavedLabel = query.isSavedLabel
      const getAllLabel = await Label.find({
         isSavedLabel: isSavedLabel,
         userId: currentUser.id,
         isDeleted: false
      })
      const result = getAllLabel
      return res.status(200).json({
         data: result,
         success: true
      })
   } catch (error) {
      console.log("this is get label error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

/* Add new saved Label */
const addSavedLabel = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const labelData = {
         labelColor: body.color,
         labelName: body.name,
         userId: currentUser.id,
         parentId: currentUser.parentId ? currentUser.parentId : currentUser.id,
         isDeleted: false,
         isSavedLabel: true
      }
      const existingLabel = await Label.find({
         labelName: body.name
      })
      if (existingLabel.length) {
         return res.status(400).json({
            message: "Label already exist, enter new name!",
            success: false
         })
      } else {
         const labelElements = new Label(labelData);
         const labelResult = await labelElements.save();
         return res.status(200).json({
            message: "Label saved successfully!",
            data: labelResult,
            success: true
         })
      }
   } catch (error) {
      console.log("this is add saved label error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
/*  update label data */
const updateLabelData = async (req, res) => {
   const { body } = req;
   try {
      await Label.findByIdAndUpdate(body._id, {
         $set: body
      })
      return res.status(200).json({
         message: "Label deleted successfully",
         success: true
      })
   } catch (error) {
      console.log("this is update label error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }

}


module.exports = {
   getAllLabelList,
   addSavedLabel,
   updateLabelData
}