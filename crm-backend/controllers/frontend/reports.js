const { OrderModel } = require("./../../models");
const mongoose = require("mongoose");
const { getDateRanges } = require("./dashboard");
const ObjectId = mongoose.Types.ObjectId;
/**
 *
 */
const getReportsByCustomerdays = async (req, res) => {
  try {
    const { currentUser, query } = req;
    const { search, page, limit, sort } = query;
    const { id, parentId } = currentUser;
    const pageNumber = ((parseInt(page) || 1) - 1) * (limit || 10);
    const limitNumber = parseInt(limit) || 10;
    const orderStatusCondition = {
      $and: [
        {
          $or: [
            {
              isDeleted: false
            },
            {
              isDeleted: {
                $exists: false
              }
            }
          ]
        },
        {
          parentId: parentId ? ObjectId(parentId) : ObjectId(id)
        },
        {
          customerId: {
            $exists: true,
            $ne: null
          }
        }
      ]
    };
    if (search) {
      orderStatusCondition["$and"].push({
        $or: [
          {
            name: {
              $regex: new RegExp(search.trim(), "i")
            }
          },
          {
            email: {
              $regex: new RegExp(search.trim(), "i")
            }
          }
        ]
      });
    }
    if (sort) {
      orderStatusCondition["$and"].push({
        referralSource: {
          $regex: new RegExp(sort.trim(), "i")
        }
      })
    }
    /*  */
    /*  */
    const result = await OrderModel.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerId"
        }
      },
      {
        $unwind: "$customerId"
      },
      {
        $addFields: {
          name: {
            $concat: ["$customerId.firstName", " ", "$customerId.lastName"]
          },
          email: "$customerId.email",
          referralSource: "$customerId.referralSource",
        }
      },
      {
        $match: orderStatusCondition
      },
      {
        $group: {
          _id: "$customerId._id",
          customerId: { $first: "$customerId" },
          name: { $first: "$name" }
        }
      },
      {
        $skip: (pageNumber)
      },
      {
        $limit: (limitNumber)
      },
    ]);
    // get count for the conditions
    const reportCount = await OrderModel.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerId"
        }
      },
      {
        $unwind: "$customerId"
      },
      {
        $addFields: {
          name: {
            $concat: ["$customerId.firstName", " ", "$customerId.lastName"]
          },
          email: "$customerId.email",
          referralSource: "$customerId.referralSource",
        }
      },
      {
        $match: orderStatusCondition
      },
      {
        $group: {
          _id: "$customerId._id",
          customerId: { $first: "$customerId" },
          name: { $first: "$name" }
        }
      },
      {
        $count: "count"
      }
    ]);

    const resp = [];
    const dates = getDateRanges();
    for (let i = 0; i < result.length; i++) {
      const customer = result[i]._id;
      let due = 0;
      let paid = 0;
      let dataToSend = {
        cusomer: customer,
        customerId: result[i].customerId
      };
      // console.log(customer);
      for (const key in dates) {
        if (dates.hasOwnProperty(key)) {
          const date = dates[key];
          const start = new Date(new Date(date.start).setUTCHours(0, 0, 0));
          const end = new Date(new Date(date.end).setUTCHours(23, 59, 59));
          const invoice = await OrderModel.aggregate([
            {
              $match: {
                $and: [
                  {
                    $or: [
                      {
                        userId: ObjectId(id)
                      },
                      {
                        parentId: ObjectId(parentId)
                      }
                    ]
                  },
                  {
                    customerId: ObjectId(customer)
                  },
                  {
                    createdAt: {
                      $gte: start,
                      $lte: end
                    }
                  }
                ]
              }
            },
            {
              $group: {
                _id: "$_id",
                paid: { $first: "$orderTotal" },
                due: {
                  $sum: { $subtract: ["$orderTotal", "$remainingAmount"] }
                }
              }
            }
          ]);
          dataToSend[key] = invoice[0]
            ? parseFloat(invoice[0].paid) + parseFloat(invoice[0].due)
            : 0;
          due += invoice[0] ? parseFloat(invoice[0].due || 0) : 0;
          paid += invoice[0] ? parseFloat(invoice[0].paid || 0) : 0;
        }
      }
      resp.push({ ...dataToSend, due, paid });
    }
    return res.status(200).json({
      data: resp,
      totalReports: reportCount[0] ? reportCount[0].count : 0,
      message: "Data fetched successfully."
    });
  } catch (error) {
    console.log(
      "=================IN getReportsByCustomerdays==================="
    );
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      message:
        "We are having problem adding part details, please try again after some time."
    });
  }
};
/**
 *
 */
module.exports = {
  getReportsByCustomerdays
};
