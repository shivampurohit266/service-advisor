const fleetModal = require("../../models/fleet");
const reteModal = require("../../models/rateStandard");

/* ------------Add New Fleet---------- */
const addNewFleet = async (req, res) => {
   const { body } = req;
   try {
      if (!body.fleetData.companyName) {
         return res.status(400).json({
            responsecode: 400,
            message: "Company name is required.",
            success: false,
         });
      }
      if (body.parentId === null) {
         body.parentId = body.userId
      }
      const fleetData = {
         companyName: body.fleetData.companyName,
         phoneDetail: body.fleetData.phoneDetail,
         email: body.fleetData.email,
         notes: body.fleetData.notes,
         address1: body.fleetData.address1,
         address2: body.fleetData.address2,
         city: body.fleetData.city,
         state: body.fleetData.state,
         zipCode: body.fleetData.zipCode,
         fleetDefaultPermissions: body.fleetData.fleetDefaultPermissions,
         userId: body.userId,
         parentId: body.parentId,
         status: true,
      };
      const addNewFleet = new fleetModal(fleetData);
      const result = await addNewFleet.save();
      if (!result) {
         return res.status(400).json({
            responsecode: 400,
            message: "Error uploading fleet data.",
            success: false,
         });
      } else {
         console.log("***********this is result", result.fleetDefaultPermissions.shouldLaborRateOverride.laborRate);

         const rateModalData = await reteModal.findById(result.fleetDefaultPermissions.shouldLaborRateOverride.laborRate)
         return res.status(200).json({
            responsecode: 200,
            message: "Fleet data uploaded successfully!",
            rateData: rateModalData,
            success: true,
         });
      }
   } catch (error) {
      console.log("This is Fleet adding error", error);
      res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false,
      });
   }
};
/* ------------Add New Fleet End---------- */

/* ------------Get Fleet list---------- */
const getAllFleetList = async (req, res) => {
   const { query, currentUser } = req;
   try {
      const limit = parseInt(query.limit || 10);
      const page = parseInt(query.page);
      const offset = (page - 1) * limit;
      const searchValue = query.search;
      const sort = query.sort;
      const status = query.status;
      let sortBy = {};
      switch (sort) {
         case "loginasc":
            sortBy = {
               updatedAt: -1,
            };
            break;
         case "nasc":
            sortBy = {
               companyName: 1,
            };
            break;
         case "ndesc":
            sortBy = {
               companyName: -1,
            };
            break;
         default:
            sortBy = {
               createdAt: -1,
            };
            break;
      }
      let condition = {};
      condition["$and"] = [
         {
            $or: [
               {
                  parentId: currentUser.id,
               },
               {
                  parentId: currentUser.parentId || currentUser.id,
               },
            ],
         },
         {
            $or: [
               {
                  isDeleted: {
                     $exists: false,
                  },
               },
               {
                  isDeleted: false,
               },
            ],
         },
      ];
      if (searchValue) {
         condition["$and"].push({
            $or: [
               {
                  companyName: {
                     $regex: new RegExp(searchValue, "i"),
                  },
               },
               {
                  email: {
                     $regex: new RegExp(searchValue, "i"),
                  },
               },
               {
                  city: {
                     $regex: new RegExp(searchValue, "i"),
                  },
               },
            ],
         });
      }
      if (status) {
         condition["$and"].push({ status: status });
      }
      const getAllFleet = await fleetModal
         .find({
            ...condition,
         })
         .collation({'locale':'en'})
         .sort(sortBy)
         .skip(offset)
         .limit(limit);
      const getAllFleetCount = await fleetModal.countDocuments({
         ...condition,
      });
      return res.status(200).json({
         responsecode: 200,
         data: getAllFleet,
         totalfleet: getAllFleetCount,
         success: true,
      });
   } catch (error) {
      console.log("This is Fleet list error", error);
      res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false,
      });
   }
};
/* ------------Get Fleet list---------- */

/* ------------Update Fleet Details---------- */
const updateFleetdetails = async (req, res) => {
   const { body } = req;
   try {
      if (!body.fleetId) {
         return res.status(400).json({
            responsecode: 400,
            message: "Fleet id is required.",
            success: false,
         });
      } else {
         const today = new Date();
         const updateFleetDetails = await fleetModal.findByIdAndUpdate(
            body.fleetId,
            {
               $set: body.fleetData,
               updatedAt: today
            }
         );
         if (!updateFleetDetails) {
            return res.status(400).json({
               responsecode: 400,
               message: "Error updating fleet details.",
               success: false,
            });
         } else {
            return res.status(200).json({
               responsecode: 200,
               message: "Fleet details updated successfully!",
               success: false,
            });
         }
      }
   } catch (error) {
      console.log("This is update Fleet error", error);
      return res.status(500).json({
         responsecode: 500,
         message: error.message ? error.message : "Unexpected error occure.",
         success: false,
      });
   }
};
/* ------------Update Fleet Details End---------- */

/* Delete Fleet */
const deleteFleet = async ({ body }, res) => {
   try {
      const data = await fleetModal.updateMany(
         {
            _id: { $in: body.fleetId }
         },
         {
            $set: {
               isDeleted: true
            }
         }
      );
      return res.status(200).json({
         message: "Fleet deleted successfully!",
         data
      });
   } catch (error) {
      console.log("this is delete fleet error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
};
/* Delete Fleet End */

/* Update fleet status */

const updateStatus = async ({ body }, res) => {
   try {
      const data = await fleetModal.updateMany(
         {
            _id: { $in: body.fleetId }
         },
         {
            $set: {
               status: body.status
            }
         }
      );
      return res.status(200).json({
         message: body.status
            ? "Fleet Activated successfully!"
            : "Fleet Inactivated successfully!",
         data
      });
   } catch (error) {
      console.log("this is fleet update status error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
};
/* Update fleet status end*/

/* Get Fleet List For customer*/
const getFleetListForCustomer = async (req, res) => {
   const { currentUser } = req;
   try {
      let condition = {};
      condition["$and"] = [
         {
            $or: [
               {
                  parentId: currentUser.id,
               },
               {
                  parentId: currentUser.parentId || currentUser.id,
               },
            ],
         },
         {
            $or: [
               {
                  isDeleted: {
                     $exists: false,
                  },
               },
               {
                  isDeleted: false,
               },
            ],
         },
      ];
      const result = await fleetModal.find({
         ...condition
      })
      if (result) {
         return res.status(200).json({
            data: result,
            success: true
         })
      } else {
         return res.status(200).json({
            message: "Fleet data not found",
            success: true
         })
      }
   } catch (error) {
      console.log("this is fleet update status error", error);
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

/* Get Fleet List For customer End*/



module.exports = {
   addNewFleet,
   getAllFleetList,
   updateFleetdetails,
   deleteFleet,
   updateStatus,
   getFleetListForCustomer
};
