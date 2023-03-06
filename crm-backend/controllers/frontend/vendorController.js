const vendorModel = require("../../models/vendor");
const commonValidation = require("../../common");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator/check");

/* -------------Create new Vendor------------ */
const createNewVendor = async (req, res) => {
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
    const addNewVendor = {
      name: body.name,
      url: body.url,
      accountNumber: body.accountNumber,
      contactPerson: body.contactPerson,
      address: body.address,
      permission: body.permission,
      userId: currentUser.id,
      parentId: currentUser.parentId
    };
    const vendorData = new vendorModel(addNewVendor);
    vendorData.save();

    return res.status(200).json({
      responsecode: 200,
      message: "Vendor added successfully!",
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
/* -------------Create new Vendor End------------ */

/* ------------Update Vendor Details---------- */
const updateVendordetails = async (req, res) => {
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
    await vendorModel.findByIdAndUpdate(body.id, {
      $set: body.data,
      updatedAt: today
    });
    return res.status(200).json({
      responsecode: 200,
      message: "Vendor details updated successfully!",
      success: true
    });
  } catch (error) {
    console.log("This is update vendor error", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Update Vendor Details End---------- */

/* ------------Get Vendor list---------- */
const getAllVendorList = async (req, res) => {
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
          name: 1
        };
        break;
      case "ndesc":
        sortBy = {
          name: -1
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
            name: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            accountNumber: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            "contactPerson.firstName": {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            "contactPerson.lastName": {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    if (status) {
      condition["$and"].push({ status: status });
    }
    const getAllVendor = await vendorModel
      .find({
        ...condition
      })
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllVendorCount = await vendorModel.countDocuments({
      ...condition
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllVendor,
      totalVendor: getAllVendorCount,
      success: true
    });
  } catch (error) {
    console.log("This is vendor list error", error);
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Get Vendor list End---------- */

/*----------------Delete Vendor-------------*/
const deleteVendor = async ({ body }, res) => {
  try {
    const data = await vendorModel.updateMany(
      {
        _id: { $in: body.vendorId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "Vendor deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is delete vendor error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/*----------------Delete Vendor End-------------*/

module.exports = {
  createNewVendor,
  updateVendordetails,
  getAllVendorList,
  deleteVendor
};
