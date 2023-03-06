const userModel = require("../../models/user");
const otherMessage = require("./../../common/validationMessage");
const mongoose = require("mongoose");

/* ----------------Grt All User List------------ */
const getAllUserList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page || 1);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const searchValue = query.search;
    const sort = query.sort;
    const status = query.status;
    const type = query.type;
    const invitaionStatus = query.invitaionStatus;
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
      },
      {
        _id: { $ne: mongoose.Types.ObjectId(id) }
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

    if (typeof status !== "undefined") {
      if (status === "1") {
        condition["$and"].push({ status: true });
      } else {
        condition["$and"].push({ status: false });
      }
    }
    if (typeof invitaionStatus !== "undefined") {
      if (invitaionStatus === "1") {
        condition["$and"].push({ userSideActivation: true });
      } else {
        condition["$and"].push({ userSideActivation: false });
      }
    }
    if (type) {
      condition["$and"].push({ roleType: mongoose.Types.ObjectId(type) });
    }
    const users = await userModel
      .aggregate([
        { $addFields: { name: { $concat: ["$firstName", " ", "$lastName"] } } },
        {
          $match: { ...condition }
        }
      ])
      .collation({ locale: "en" })
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllUser = await userModel.populate(users, { path: "roleType currentlyWorking.orderId currentlyWorking.serviceId" });

    const getAllUserCount = await userModel.aggregate([
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
      data: getAllUser,
      totalUsers: getAllUserCount[0] ? getAllUserCount[0].count : 0,
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
/* ----------------Grt All User List End------------ */

/* Delete User */
const deleteUser = async ({ body }, res) => {
  try {
    const data = await userModel.updateMany(
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
      message: "User deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Delete User */

/* get single user info*/
const getProfile = async (req, res) => {
  const { currentUser } = req;
  try {
    let userFind
    if (currentUser.parentId && (mongoose.Types.ObjectId(currentUser.parentId) !== mongoose.Types.ObjectId(currentUser.id))) {
      userFind = await userModel.findOne({
        _id: currentUser.id,
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }]
      }).populate({ path: "planId parentId", populate: { path: "planId" } })
    } else {
      userFind = await userModel.findOne({
        _id: currentUser.id,
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }]
      }).populate("planId");
    }
    if (userFind) {
      return res.status(200).json({
        responseCode: 200,
        data: userFind,
        success: true
      });
    } else {
      return res.status(401).json({
        responseCode: 401,
        message: otherMessage.userNotExist,
        success: false
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* Update users status */
const updateStatus = async ({ body }, res) => {
  try {
    const data = await userModel.updateMany(
      {
        _id: { $in: body.users }
      },
      {
        $set: {
          status: body.status
        }
      }
    );
    return res.status(200).json({
      message: body.status
        ? "Member activated successfully!"
        : "Member inactivated successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const getTechnicianData = async (req, res) => {
  const { query } = req;
  try {
    const userFind = await userModel.findOne({
      _id: query.id,
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }]
    });

    if (userFind) {
      return res.status(200).json({
        responseCode: 200,
        data: userFind,
        success: true
      });
    } else {
      return res.status(401).json({
        responseCode: 401,
        message: otherMessage.userNotExist,
        success: false
      });
    }
  } catch (error) {
    console.log("this is get all user error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
}
module.exports = {
  deleteUser,
  getAllUserList,
  getProfile,
  updateStatus,
  getTechnicianData
};
