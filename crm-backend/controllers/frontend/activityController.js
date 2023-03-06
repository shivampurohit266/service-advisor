const userActivityModal = require("../../models/userActivity");
const mongoose = require("mongoose");

/*
 Create new Activity
*/
const createNewActivity = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const addNewActivity = {
         name: body.name,
         type: body.type,
         orderId: mongoose.Types.ObjectId(body.orderId) || null,
         activityPerson: mongoose.Types.ObjectId(currentUser.id) || null,
         userId: mongoose.Types.ObjectId(currentUser.id) || null,
         parentId: mongoose.Types.ObjectId(currentUser.parentId) || mongoose.Types.ObjectId(currentUser.id)
      };
      const activityData = new userActivityModal(addNewActivity);
      await activityData.save();
      return res.status(200).json({
         message: "Activity added successfully.",
         success: true
      });
   } catch (error) {
      console.log("**************This is add new activity error =>", error);
      return res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
};
/*
Get All Activity
*/
const getAllActivity = async (req, res) => {
   const { query, currentUser } = req;
   try {
      const orderId = query.orderId;
      const id = currentUser.id;
      const parentId = currentUser.parentId || currentUser.id;
      let condition = {};
      condition["$and"] = [
         {
            $or: [
               {
                  userId: mongoose.Types.ObjectId(id)
               },
               {
                  parentId: mongoose.Types.ObjectId(parentId)
               }
            ]
         },
         {
            $or: [
               {
                  isDeleted: {
                     $exists: false
                  }
               },
               {
                  isDeleted: false
               }
            ]
         },
         {
            orderId: mongoose.Types.ObjectId(orderId)
         }
      ];

      const getAllActivity = await userActivityModal
         .find(condition)
         .populate("activityPerson")

      return res.status(200).json({
         responsecode: 200,
         data: getAllActivity,
         success: true
      });
   } catch (error) {
      console.log("**************This is get all activity error =>", error);
      return res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}
module.exports = {
   createNewActivity,
   getAllActivity
};
