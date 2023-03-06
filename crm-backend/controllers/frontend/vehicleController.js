const vehicleModal = require("../../models/vehicle");
const customerModel = require("../../models/customer");
const mongoose = require("mongoose");
/* ------------Add New Vehicle------------ */
const addNewVehicle = async (req, res) => {
  const { body } = req;
  try {
    const vehicleData = {
      year: parseInt(body.year),
      make: body.make,
      modal: body.modal,
      type: body.type,
      miles: body.miles,
      color: body.color,
      licensePlate: body.licensePlate,
      unit: body.unit,
      vin: body.vin,
      subModal: body.subModal,
      engineSize: body.engineSize,
      productionDate: body.productionDate,
      transmission: body.transmission,
      drivetrain: body.drivetrain,
      notes: body.notes,
      parentId: body.parentId,
      userId: body.userId
    };
    const data = await vehicleModal.find({
      isDeleted: false, parentId: body.parentId,
      userId: body.userId, licensePlate: body.licensePlate
    });
    if (data.length) {
      return res.status(400).json({
        message: "License Plate number already exit.",
      })
    }
    if (body.vin) {
      const result = await vehicleModal.find({
        isDeleted: false, parentId: body.parentId,
        userId: body.userId, vin: body.vin
      });
      if (result.length) {
        return res.status(400).json({
          message: "Vin number already exit.",
        })
      }
    }
    const addVehicleData = new vehicleModal(vehicleData);
    const vehicles = await addVehicleData.save();
    if (body.customerId) {
      // vehicles
      await customerModel.updateOne(
        { _id: body.customerId },
        {
          $push: {
            vehicles: vehicles._id
          }
        }
      );
    }
    return res.status(200).json({
      responsecode: 200,
      data: vehicles,
      message: !body.customerId
        ? "Vehicle data uploaded successfully!"
        : "Vehicle assigned to customer successfully!",
      success: true
    });
  } catch (error) {
    console.log("This is vehicle adding error", error);
    res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* ------------Add New Vehicle End------------ */

/* ----------------Grt All User List------------ */
const getAllVehicleList = async (req, res) => {
  const { query, currentUser } = req;
  try {
    const limit = parseInt(query.limit || 10);
    const page = parseInt(query.page) || 1;
    const offset = page < 1 ? 0 : (page - 1) * limit;
    const searchValue = query.search;
    const vehicleId = query.vehicleId
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
          make: 1
        };
        break;
      case "ndesc":
        sortBy = {
          make: -1
        };
        break;
      default:
        sortBy = {
          createdAt: -1
        };
        break;
    }
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            parentId: mongoose.Types.ObjectId(currentUser.id)
          },
          {
            parentId: mongoose.Types.ObjectId(
              currentUser.parentId || currentUser.id
            )
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
        _id: { $ne: mongoose.Types.ObjectId(currentUser.id) }
      }
    ];
    if (searchValue) {
      condition["$and"].push({
        $or: [
          {
            type: {
              label: {
                $regex: new RegExp(searchValue.trim(), "i")
              }
            }
          },
          {
            make: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            modal: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            licensePlate: {
              $regex: new RegExp(searchValue.trim(), "i")
            }
          },
          {
            vin: {
              $regex: new RegExp(`${searchValue.trim()}`, "i")
            }
          }
        ]
      });
    }

    if (typeof status !== "undefined") {
      condition["$and"].push({ status: status });
    }
    if (vehicleId) {
      condition["$and"].push({
        _id: mongoose.Types.ObjectId(vehicleId)
      });
    }
    const getAllVehicle = await vehicleModal
      .aggregate([
        {
          $match: { ...condition }
        }
      ])
      .collation({ locale: "en" })
      .allowDiskUse(true)
      .sort(sortBy)
      .skip(offset)
      .limit(limit);
    const getAllVehicleCount = await vehicleModal.countDocuments({
      ...condition
    });
    return res.status(200).json({
      responsecode: 200,
      data: getAllVehicle,
      totalVehicles: getAllVehicleCount,
      success: true
    });
  } catch (error) {
    console.log("this is get all vehicle error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/* List Of all vehicles end */

/* update the vehicle */
const updateVehicleDetails = async (req, res) => {
  const { body, currentUser } = req;
  const { parentId, id } = currentUser
  try {
    if (!body.data.vehicleId) {
      return res.status(400).json({
        responsecode: 400,
        message: "Vehicle id is required.",
        success: false
      });
    } else {
      const data = await vehicleModal.find({ _id: { $ne: body.data.vehicleId }, isDeleted: false, licensePlate: body.data.licensePlate, parentId: parentId || id });
      if (data.length) {
        return res.status(400).json({
          message: "License Plate number already exit.",
        })
      }
      if (body.data.vin && body.data.vin !== "") {
        const result = await vehicleModal.find({ _id: { $ne: body.data.vehicleId }, isDeleted: false, vin: body.data.vin, parentId: parentId || id });
        if (result.length) {
          return res.status(400).json({
            message: "Vin number already exit.",
          })
        }
      }
      const today = new Date();
      const updateVehicleDetails = await vehicleModal.findByIdAndUpdate(
        body.data.vehicleId,
        {
          $set: body.data,
          updatedAt: today
        }
      );
      if (!updateVehicleDetails) {
        return res.status(400).json({
          responsecode: 400,
          message: "Error updating customer details.",
          success: false
        });
      } else {
        return res.status(200).json({
          responsecode: 200,
          message: "Vehicle details updated successfully!",
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
/* end of update vehicle */

/* Delete Customer */
const deleteVehicle = async ({ body }, res) => {
  try {
    const data = await vehicleModal.updateMany(
      {
        _id: { $in: body.vehicleId }
      },
      {
        $set: {
          isDeleted: true
        }
      }
    );
    return res.status(200).json({
      message: "Vehicle deleted successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all vehicle error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
  // try {
  //   const { vehicleId } = params;
  //   const data = await vehicleModal.findByIdAndUpdate(vehicleId, {
  //     isDeleted: true
  //   });
  //   return res.status(200).json({
  //     message: "Vehicle deleted successfully!",
  //     data,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     message: error.message ? error.message : "Unexpected error occure.",
  //     success: false,
  //   });
  // }
};
/* Delete Customer */

/* Update vehicle status */
const updateStatus = async ({ body }, res) => {
  try {
    const data = await vehicleModal.updateMany(
      {
        _id: { $in: body.vehicles }
      },
      {
        $set: {
          status: body.status
        }
      }
    );
    return res.status(200).json({
      message: body.status
        ? "Vehicle Activated successfully!"
        : "Vehicle Inactivated successfully!",
      data
    });
  } catch (error) {
    console.log("this is get all vehicle error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
const bulkVehicleAdd = async (req, res) => {
  const { body, currentUser } = req;
  const { parentId, id } = currentUser
  var i,
    j,
    temparray,
    chunk = 500;
  for (i = 0, j = body.length; i < j; i += chunk) {
    temparray = body.slice(i, i + chunk);
    if (temparray && temparray.length) {
      for (let k = 0; k < temparray.length; k++) {
        const data = await vehicleModal.find({
          isDeleted: false, parentId: parentId || id, licensePlate: temparray[k].licensePlate
        });
        if (data.length) {
          return res.status(400).json({
            message: "License Plate number already exit.",
          })
          break;
        }
        if (temparray[k].vin) {
          const result = await vehicleModal.find({
            isDeleted: false, parentId: parentId || id, vin: temparray[k].vin
          });
          if (result.length) {
            return res.status(400).json({
              message: "Vin number already exit.",
            })
            break;
          }
        }
      }
    }
    vehicleModal.insertMany(temparray);
  }
  res
    .status(200)
    .json({ message: `${body.length} records added successfully!` });
};
module.exports = {
  addNewVehicle,
  getAllVehicleList,
  updateVehicleDetails,
  deleteVehicle,
  updateStatus,
  bulkVehicleAdd
};
