const matrixModel = require("../../models/priceMatrix");
const commonValidation = require("../../common");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

/*Add New Price Matrix*/
const createpriceMatrix = async (req, res) => {
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
    const newPriceMatrixData = {
      matrixName: body.matrixName,
      matrixRange: body.matrixRange,
      parentId: currentUser.parentId,
      userId: currentUser.id,
      status: true,
      isDeleted: false
    };
    const matrixData = new matrixModel(newPriceMatrixData);
    matrixData.save();
    return res.status(200).json({
      responsecode: 200,
      message: "Price matrix added successfully!",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*Add New Price Matrix End*/

/*Update Price Matrix*/
const updatepriceMatrix = async (req, res) => {
  const { body } = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: commonValidation.formatValidationErr(errors.mapped(), true),
      success: false
    });
  }
  try {
    await matrixModel.findByIdAndUpdate(mongoose.Types.ObjectId(body.id), {
      $set: body
    });
    return res.status(200).json({
      responsecode: 200,
      message: "Matrix details updated successfully!",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*Add New Price Matrix End*/

/*Get All Price Metrices*/
const getAllMatrix = async (req, res) => {
  const { currentUser, query } = req;
  try {
    if (currentUser.parentId === null || currentUser.parentId === "undefined") {
      currentUser.parentId = currentUser.id;
    }
    const searchValue = query.search;
    const { sort } = query
    const id = currentUser.id;
    const parentId = currentUser.parentId || currentUser.id;
    let sortBy = {};
    switch (sort) {
      case "createddesc":
        sortBy = {
          createdAt: -1,
        };
        break;
      case "nasc":
        sortBy = {
          matrixName: 1,
        };
        break;
      case "ndesc":
        sortBy = {
          matrixName: -1,
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
            matrixName: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }

    const matrices = await matrixModel.find(condition).collation({ locale: "en" }).sort(sortBy);
    return res.status(200).json({
      responsecode: 200,
      success: true,
      data: matrices
    });
  } catch (error) {
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*Get All Price Metrices End*/

/*Delete Tier*/
const deleteMatrix = async ({ body }, res) => {
  try {
    const data = await matrixModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(body.matrixId),
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "Matrix deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is delete Matrix error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*Delete tier End*/
module.exports = {
  createpriceMatrix,
  getAllMatrix,
  updatepriceMatrix,
  deleteMatrix
};
