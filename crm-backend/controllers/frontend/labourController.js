const rateStandardModel = require("../../models/rateStandard");
const mongoose = require("mongoose");
const labourModel = require("../../models/labour");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");
/* -------------Get All Standard Rate------------ */
const getAllStandardRate = async (req, res) => {
  const { currentUser } = req
  try {
    let $data = req.query;
    let condition = {
      name: new RegExp($data.searchValue, "i")
    };
    const getAllStdRate = await rateStandardModel.find({
      parentId: mongoose.Types.ObjectId(currentUser.parentId),
      ...condition
    });
    if (getAllStdRate) {
      return res.status(200).json({
        responsecode: 200,
        success: true,
        data: getAllStdRate
      });
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Get All Roles End------------ */

/* -------------Add Rate Standard ------------ */
const addNewrateStandard = async (req, res) => {
  const { body } = req;
  try {
    if (body.parentId === null) {
      body.parentId = body.userId;
    }
    if (!body.data.name) {
      return res.status(400).json({
        message: "Name is required."
      });
    }
    if (!body.data.hourRate) {
      return res.status(400).json({
        message: "Hour rate is required."
      });
    }
    const newRateData = {
      name: body.data.name,
      hourlyRate: body.data.hourRate,
      parentId: body.parentId,
      userId: body.userId,
      status: true
    };
    const addNewRateData = new rateStandardModel(newRateData);
    const result = await addNewRateData.save();
    if (!result) {
      return res.status(400).json({
        message: "Error adding rate standard",
        success: false
      });
    } else {
      return res.status(200).json({
        data: result,
        message: "Rate standard added successfully!.",
        success: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Add Rate Standard End------------ */

/* -------------Get Single Rate Standard------------ */
const getSingleStandardRate = async (req, res) => {
  try {
    let data = req.body;
    const getSingleStdRate = await rateStandardModel.findById(data.rateId);
    if (getSingleStdRate) {
      return res.status(200).json({
        responsecode: 200,
        success: true,
        data: getSingleStdRate
      });
    } else {
      return res.status(400).json({
        responsecode: 200,
        success: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Get Single Rate Standard End------------ */

/* -------------Create new labour------------ */
const createNewLabour = async (req, res) => {
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
    const addNewLabour = {
      discription: body.discription,
      hours: body.hours,
      rate: body.rate,
      discount: body.discount,
      notes: body.notes,
      permission: body.permission,
      userId: currentUser.id,
      parentId: currentUser.parentId
    };
    const labourData = new labourModel(addNewLabour);
    await labourData.save();
    const result = await labourModel.findById(labourData._id).populate("rate")
    return res.status(200).json({
      responsecode: 200,
      message: "Labor added successfully!",
      laborData: result,
      success: true
    });
  } catch (error) {
    console.log("**************This is add new labour error =>", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* -------------Create new labour End------------ */

/* ------------Update Labour Details---------- */
const updateLabourdetails = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    const today = new Date();
    await labourModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(body.labourId),
      {
        $set: body,
        updatedAt: today
      }
    );
    return res.status(200).json({
      responsecode: 200,
      message: "Labor details updated successfully!",
      success: true
    });
  } catch (error) {
    console.log("This is update labour error", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Update Labour Details End---------- */

/* ------------Get Labour list---------- */
const getAllLabourList = async (req, res) => {
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
          updatedAt: -1
        };
        break;
      case "nasc":
        sortBy = {
          discription: 1
        };
        break;
      case "ndesc":
        sortBy = {
          discription: -1
        };
        break;
      case "pasc":
        sortBy = {
          "rate.hourlyRate": 1
        };
        break;
      case "pdesc":
        sortBy = {
          "rate.hourlyRate": -1
        };
        break;
      case "diasc":
        sortBy = {
          discount: 1
        };
        break;
      case "didesc":
        sortBy = {
          discount: -1
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
            discription: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            note: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            hour: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            discount: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    if (status) {
      condition["$and"].push({ status: status });
    }
    const getAllLabour = await labourModel
      .find(condition)
      .populate("rate")
      .collation({ locale: "en_US", numericOrdering: true })
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllLabourCount = await labourModel.countDocuments({
      ...condition
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllLabour,
      totalLabour: getAllLabourCount,
      success: true
    });
  } catch (error) {
    console.log("This is labour list error", error);
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Get Labour list End---------- */

/*----------------Delete Labour-------------*/
const deleteLabour = async ({ body }, res) => {
  try {
    const data = await labourModel.updateMany(
      {
        _id: { $in: body.labourId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "labor deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is delete labour error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*----------------Delete Labour End-------------*/

module.exports = {
  getAllStandardRate,
  addNewrateStandard,
  getSingleStandardRate,
  createNewLabour,
  updateLabourdetails,
  getAllLabourList,
  deleteLabour
};
