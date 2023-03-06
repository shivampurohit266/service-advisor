const Tires = require("../../models/tier");
const Parts = require("./../../models/parts");
const mongoose = require("mongoose");
const getStats = async (req, res) => {
  const { currentUser } = req;
  const id = mongoose.Types.ObjectId(currentUser.id);
  const parentId = mongoose.Types.ObjectId(
    currentUser.parentId || currentUser.id
  );
  const condition = {
    $and: [
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
        $or: [
          {
            parentId: id
          },
          {
            parentId: parentId
          }
        ]
      }
    ]
  };
  try {
    const tireCostSum = await Tires.aggregate([
      { $match: condition },
      {
        $unwind: "$tierSize"
      },
      {
        $group: {
          _id: "tempId",
          totalValue: {
            $sum: "$tierSize.cost"
          }
        }
      }
    ]);
    const tireRetailSum = await Tires.aggregate([
      { $match: condition },
      {
        $unwind: "$tierSize"
      },
      {
        $group: {
          _id: "tempId",
          totalValue: {
            $sum: "$tierSize.retailPrice"
          }
        }
      }
    ]);
    const partCostSum = await Parts.aggregate([
      { $match: condition },
      {
        $unwind: "$cost"
      },
      {
        $group: {
          _id: "tempId",
          totalValue: {
            $sum: "$cost"
          }
        }
      }
    ]);
    const partRetailSum = await Parts.aggregate([
      { $match: condition },
      {
        $unwind: "$retailPrice"
      },
      {
        $group: {
          _id: "tempId",
          totalValue: {
            $sum: "$retailPrice"
          }
        }
      }
    ]);
    console.log("====================================");
    console.log(partCostSum);
    console.log("====================================");
    return res.json({
      data: {
        quantity: {
          parts: await Parts.countDocuments(condition),
          tires: await Tires.countDocuments(condition)
        },
        cost: {
          parts: partCostSum[0] ? partCostSum[0].totalValue : 0,
          tires: tireCostSum[0] ? tireCostSum[0].totalValue : 0
        },
        value: {
          parts: partRetailSum[0] ? partRetailSum[0].totalValue : 0,
          tires: tireRetailSum[0] ? tireRetailSum[0].totalValue : 0
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        quantity: {
          parts: 0,
          tires: 0
        },
        cost: {
          parts: 0,
          tires: 0
        },
        value: {
          parts: 0,
          tires: 0
        }
      }
    });
  }
};
module.exports = {
  getStats
};
