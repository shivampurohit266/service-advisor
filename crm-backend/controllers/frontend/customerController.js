const customerModel = require("../../models/customer");
const commonValidation = require("../../common/index");
const { otherMessage } = require("../../common/validationMessage");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

/*----------------Customer create by admin/staff------------------ */
const createCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: commonValidation.formatValidationErr(errors.mapped(), true),
        success: false
      });
    }
    const { body } = req;
    const cusomerData = {
      firstName: body.firstName,
      lastName: body.lastName,
      phoneDetail: body.phoneDetail,
      email: body.email,
      notes: body.notes,
      companyName: body.companyName,
      referralSource: body.referralSource,
      fleet: body.fleet !== "" ? body.fleet : null,
      address1: body.address1,
      address2: body.address2,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      permission: body.permission,
      parentId: body.parentId,
      userId: body.userId,
      status: true
    };

    let result = await customerModel(cusomerData).save();
    if (result) {
      return res.status(200).json({
        message: otherMessage.newCustomer,
        success: true,
        data: result
      });
    } else {
      return res.status(400).json({
        result: result,
        message: "Error in inserting Customer.",
        success: false
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* get all the customer list  with search */

const getAllCustomerList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = query.page && query.page > 1 ? parseInt(query.page) : 1;
    const offset = (page - 1) * limit;
    const searchValue = query.search ? query.search : "";
    const sort = query.sort;
    const customerId = query.customerId;
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
          firstName: 1,
          lastName: 1
        };
        break;
      case "ndesc":
        sortBy = {
          firstName: -1,
          lastName: 1
        };
        break;
      default:
        sortBy = {
          createdAt: -1
        };
        break;
    }
    let condition = {};
    const id = currentUser.id;
    const parentId = currentUser.parentId || currentUser.id;
    if (typeof status != "undefined") {
      condition.status = parseInt(status) === 1 ? true : false;
    }
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
            email: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          }
        ]
      });
    }
    if (customerId) {
      condition["$and"].push({
        _id: mongoose.Types.ObjectId(customerId)
      });
    }
    const users = await customerModel
      .aggregate([
        { $addFields: { name: { $concat: ["$firstName", " ", "$lastName"] } } },
        {
          $match: { ...condition }
        }
      ])
      .collation({ locale: "en" })
      .allowDiskUse(true)
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllCustomer = await customerModel.populate(users, {
      path: "fleet vehicles"
    });
    const getAllCustomerCount = await customerModel.aggregate([
      { $addFields: { name: { $concat: ["$firstName", " ", "$lastName"] } } },
      {
        $match: { ...condition }
      },
      {
        $count: "count"
      }
    ]);
    return res.status(200).json({
      responsecode: 200,
      data: getAllCustomer,
      totalUsers: getAllCustomerCount[0] ? getAllCustomerCount[0].count : 0,
      success: true
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* Delete Customer */
const deleteCustomer = async ({ body }, res) => {
  try {
    const data = await customerModel.updateMany(
      {
        _id: { $in: body.userId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "Customer deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all customer error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Delete Customer */

/* update customer data */
const updateCustomerdetails = async (req, res) => {
  const { body } = req;
  try {
    if (!body.data.customerId) {
      return res.status(400).json({
        responsecode: 400,
        message: "Customer id is required.",
        success: false
      });
    } else {
      const today = new Date();
      const updateCustomerDetails = await customerModel.findByIdAndUpdate(
        body.data.customerId,
        {
          $set: body.data,
          updatedAt: today
        }
      );
      if (!updateCustomerDetails) {
        return res.status(400).json({
          responsecode: 400,
          message: "Error updating customer details.",
          success: false
        });
      } else {
        return res.status(200).json({
          responsecode: 200,
          message: "Customer details updated successfully!",
          success: false
        });
      }
    }
  } catch (error) {
    console.log("This is update Customer error", error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/* UPDATE CUSTOMER STATUS */
const updateStatus = async ({ body }, res) => {
  try {
    const data = await customerModel.updateMany(
      {
        _id: { $in: body.customers }
      },
      {
        $set: {
          status: body.status
        }
      }
    );
    return res.status(200).json({
      message: body.status
        ? "Customer Activated successfully!"
        : "Customer Inactivated successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all customer error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const bulkCustomerAdd = async (req, res) => {
  const { body } = req;
  var i,
    j,
    temparray,
    chunk = 500;
  for (i = 0, j = body.length; i < j; i += chunk) {
    temparray = body.slice(i, i + chunk);
    customerModel.insertMany(temparray);
  }
  res
    .status(200)
    .json({ message: `${body.length} records added successfully!` });
};
/**
 *
 */
module.exports = {
  createCustomer,
  getAllCustomerList,
  deleteCustomer,
  updateCustomerdetails,
  updateStatus,
  bulkCustomerAdd
};
