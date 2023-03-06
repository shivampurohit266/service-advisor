const tierModel = require("../../models/tier");
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");

/* -------------Create new Tier------------ */
const createNewTier = async (req, res) => {
  const { body, currentUser } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    if (currentUser.parentId === null || currentUser.parentId === "undefined") {
      currentUser.parentId = currentUser.id;
    }
    let tireSizeArray = [];
    for (let index = 0; index < body.tierSize.length; index++) {
      const element = body.tierSize[index];
      if (
        element.notes ||
        element.part ||
        element.bin ||
        element.quantity ||
        element.criticalQuantity ||
        element.cost ||
        element.priceMatrix ||
        element.retailPrice ||
        element.markup ||
        element.margin ||
        element.baseInfo
      ) {
        try {
          element.priceMatrix = element.priceMatrix ? mongoose.Types.ObjectId(element.priceMatrix) : null;
        } catch (error) {
          delete element.priceMatrix;
        }
        tireSizeArray.push(element);
      }
    }
    const addNewTier = {
      brandName: body.brandName,
      modalName: body.modalName,
      vendorId: body.vendorId ? body.vendorId : null,
      seasonality: body.seasonality,
      tierSize: tireSizeArray,
      tierPermission: body.tierPermission,
      userId: currentUser.id,
      parentId: currentUser.parentId
    };
    const tierData = new tierModel(addNewTier);
    const result = tierData.save();

    return res.status(200).json({
      responsecode: 200,
      message: "Tire added successfully!",
      tierData,
      success: true
    });
  } catch (error) {
    console.log("**************This is add new tier error =>", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Create new Tier End------------ */

/* ------------Update Tier Details---------- */
const updateTierdetails = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const today = new Date();
    let tireSizeArray = [];
    for (let index = 0; index < body.data.tierSize.length; index++) {
      const element = body.data.tierSize[index];
      if (
        element.notes ||
        element.part ||
        element.bin ||
        element.quantity ||
        element.criticalQuantity ||
        element.cost ||
        element.priceMatrix ||
        element.retailPrice ||
        element.markup ||
        element.margin ||
        element.baseInfo
      ) {
        try {
          element.priceMatrix = element.priceMatrix ? mongoose.Types.ObjectId(element.priceMatrix) : null;
        } catch (error) {
          delete element.priceMatrix;
        }
        tireSizeArray.push(element);
      }
    }
    await tierModel.findByIdAndUpdate(mongoose.Types.ObjectId(body.id), {
      $set: {
        ...body.data,
        updatedAt: today,
        tierSize: tireSizeArray
      }
    });
    return res.status(200).json({
      responsecode: 200,
      message: "Tire details updated successfully!",
      success: true
    });
  } catch (error) {
    console.log("This is update tier error", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Update Tier Details End---------- */

/* ------------Get Tier list---------- */
const getAllTierList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page);
    const offset = (page - 1) * limit;
    const searchValue = query.search;
    const sort = query.sort;
    const status = query.status;
    const vendorId = query.vendorId;
    let sortBy = {};
    switch (sort) {
      case "qltoh":
        sortBy = {
          "tierSize.quantity": 1
        };
        break;
      case "qhtol":
        sortBy = {
          "tierSize.quantity": -1
        };
        break;
      case "cltoh":
        sortBy = {
          "tierSize.cost": 1
        };
        break;
      case "chtol":
        sortBy = {
          "tierSize.cost": -1
        };
        break;
      case "rpltoh":
        sortBy = {
          "tierSize.retailPrice": 1
        };
        break;
      case "rphtol":
        sortBy = {
          "tierSize.retailPrice": -1
        };
        break;
      default:
        sortBy = {
          createdAt: -1
        };
        break;
    }
    const id = currentUser.id;
    const parentId = currentUser.parentId || currentUser.id;
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            parentId: mongoose.Types.ObjectId(id)
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
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            brandName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            modalName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            seasonality: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    if (status) {
      if (status.toString() === "critical") {
        condition["$and"].push({
          $expr: {
            $lte: ["$tierSize.quantity", "$criticalQuantity"]
          }
        });
      } else if (status.toString() === "ncritical") {
        condition["$and"].push({
          $expr: {
            $gt: ["$tierSize.quantity", "$criticalQuantity"]
          }
        });
      }
    }
    if (vendorId) {
      condition["$and"].push({
        vendorId: mongoose.Types.ObjectId(vendorId)
      });
    }
    const getAllTier = await tierModel
      .find(condition)
      .populate("vendorId")
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllTierCount = await tierModel.countDocuments({
      ...condition
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllTier,
      totalTier: getAllTierCount,
      success: true
    });
  } catch (error) {
    console.log("This is tier list error", error);
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Get Tier list End---------- */

/*----------------Delete Tier-------------*/
const deleteTier = async ({ body }, res) => {
  try {
    const data = await tierModel.updateMany(
      {
        _id: { $in: body.tireId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "Tire deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is delete tier error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*----------------Delete tier End-------------*/

/* Update tire status */
const updateStatus = async ({ body }, res) => {
  try {
    const data = await tierModel.updateMany(
      {
        _id: { $in: body.tires }
      },
      {
        $set: {
          status: body.status
        }
      }
    );
    return res.status(200).json({
      message: body.status
        ? "Tire activated successfully!"
        : "Tire inactivated successfully!",
      data
    });
  } catch (error) {
    console.log("this is update status of tire error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
module.exports = {
  createNewTier,
  updateTierdetails,
  getAllTierList,
  deleteTier,
  updateStatus
};
