const Parts = require("./../../models/parts");
const mongoose = require("mongoose");
const add = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (currentUser.parentId === null || currentUser.parentId === "undefined") {
      currentUser.parentId = currentUser.id;
    }
    const {
      partDescription,
      note,
      priceMatrix,
      vendorId,
      location,
      cost,
      price,
      markup,
      margin,
      criticalQuantity,
      quantity,
      quickBookItem,
      partNumber,
      partOptions
    } = body;
    let data = {
      partNumber,
      createdBy: currentUser.id,
      parentId: currentUser.parentId,
      description: partDescription,
      note: note || "",
      location: location || "",
      cost: cost || 0,
      retailPrice: price || 0,
      markup: markup || 0,
      margin: margin || 0,
      quickBookItem: quickBookItem || "",
      criticalQuantity: criticalQuantity || 0,
      quantity: quantity || 0,
      partOptions
    };
    if (priceMatrix) {
      data.priceMatrix = priceMatrix;
    }
    if (vendorId) {
      data.vendorId = vendorId;
    }
    const part = new Parts(data);
    const result = await part.save();
    return res.status(200).json({
      message: "Part details added successfully.",
      result
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      message:
        "We are having problem adding part details, please try again after some time."
    });
  }
};

const getList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page);
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const searchValue = query.search;
    const sort = query.sort;
    const status = query.status;
    const vendorId = query.vendorId;
    let sortBy = {};
    switch (sort) {
      case "qltoh":
        sortBy = {
          quantity: 1
        };
        break;
      case "qhtol":
        sortBy = {
          quantity: -1
        };
        break;
      case "cltoh":
        sortBy = {
          cost: 1
        };
        break;
      case "chtol":
        sortBy = {
          cost: -1
        };
        break;
      case "rpltoh":
        sortBy = {
          retailPrice: 1
        };
        break;
      case "rphtol":
        sortBy = {
          retailPrice: -1
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
            description: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            note: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            partNumber: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            location: {
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
            $lte: ["$quantity", "$criticalQuantity"]
          }
        });
      } else if (status.toString() === "ncritical") {
        condition["$and"].push({
          $expr: {
            $gt: ["$quantity", "$criticalQuantity"]
          }
        });
      }
    }
    if (vendorId) {
      condition["$and"].push({
        vendorId: mongoose.Types.ObjectId(vendorId)
      });
    }
    const parts = await Parts.find(condition)
      .populate("vendorId")
      .skip(offset)
      .limit(limit)
      .sort(sortBy);
    const total = await Parts.countDocuments(condition);
    return res.status(200).json({
      responsecode: 200,
      parts,
      total,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

const deletePart = async (req, res) => {
  try {
    const { body } = req;
    const data = await Parts.updateMany(
      {
        _id: { $in: body }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    res.status(200).json({
      message:
        body.length > 1
          ? "Parts deleted successfully!"
          : "Part deleted successfully!",
      data
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

const update = async (req, res) => {
  try {
    const { body, currentUser } = req;
    if (currentUser.parentId === null || currentUser.parentId === "undefined") {
      currentUser.parentId = currentUser.id;
    }
    const {
      partDescription,
      note,
      priceMatrix,
      vendorId,
      location,
      cost,
      price,
      markup,
      margin,
      criticalQuantity,
      quantity,
      quickBookItem,
      partNumber,
      partOptions
    } = body;
    let data = {
      partNumber,
      createdBy: currentUser.id,
      parentId: currentUser.parentId,
      description: partDescription,
      note: note || "",
      location: location || "",
      cost: cost || 0,
      retailPrice: price || 0,
      markup: markup || 0,
      margin: margin || 0,
      quickBookItem: quickBookItem || "",
      criticalQuantity: criticalQuantity || 0,
      quantity: quantity || 0,
      partOptions
    };
    if (priceMatrix) {
      data.priceMatrix = priceMatrix;
    }
    if (vendorId) {
      data.vendorId = vendorId;
    }
    const today = new Date();
    const result = await Parts.updateOne(
      {
        _id: body.id
      },
      {
        $set: data,
        updatedAt: today
      }
    );
    res.status(200).json({
      message: "Part details udpated successfully.",
      result
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      message:
        "We are having problem adding part details, please try again after some time."
    });
  }
};

module.exports = {
  add,
  getList,
  deletePart,
  update
};
