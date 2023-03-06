const {
  OrderModel,
  CustomerModel,
  VehicleModel,
  UserModel
} = require("./../../models");
const { CustomerAgeTypes } = require("./../../config/cusomer");
const moment = require("moment");
const { Types } = require("mongoose");
const { ObjectId } = Types;
/**
 *
 */
const getOverview = async (req, res) => {
  try {
    const { currentUser } = req;
    const { id, parentId } = currentUser;
    const ordercondition = {
      userId: id,
      parentId: parentId || currentUser.id,
      isDeleted: false
    };
    const technicianCondition = {
      $and: [
        {
          $or: [
            {
              parentId: id
            },
            {
              parentId: parentId || currentUser.id
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
          _id: { $ne: id }
        }
      ]
    };
    const orderCount = await OrderModel.count(ordercondition);
    const customerCount = await CustomerModel.count(ordercondition);
    const vehicleCount = await VehicleModel.count(ordercondition);
    const technicianCount = await UserModel.count(technicianCondition);

    return res.status(200).json({
      data: {
        orderCount,
        customerCount,
        vehicleCount,
        technicianCount
      },
      message: "Data feched successfully."
    });
  } catch (error) {
    console.log("Error while fetching issues", error);
    return res.status(500).json({
      message: "We are having an error."
    });
  }
};
/**
 *
 */
const getDateRanges = () => {
  return {
    [CustomerAgeTypes.ZERO_DAYS]: {
      start: moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    },
    [CustomerAgeTypes.THIRTY_DAYS]: {
      start: moment()
        .subtract(60, "days")
        .format("YYYY-MM-DD"),
      end: moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD")
    },
    [CustomerAgeTypes.SIXTY_DAYS]: {
      start: moment()
        .subtract(60, "days")
        .format("YYYY-MM-DD"),
      end: moment()
        .subtract(90, "days")
        .format("YYYY-MM-DD")
    },
    [CustomerAgeTypes.NINETY_DAYS]: {
      start: moment()
        .subtract(90, "days")
        .format("YYYY-MM-DD"),
      end: moment()
        .subtract(10, "years")
        .format("YYYY-MM-DD")
    }
  };
};
/**
 *
 */
const getCustomers = async (id, parentId) => {
  const dates = getDateRanges();
  let res = {
    [CustomerAgeTypes.ZERO_DAYS]: [],
    [CustomerAgeTypes.THIRTY_DAYS]: [],
    [CustomerAgeTypes.SIXTY_DAYS]: [],
    [CustomerAgeTypes.NINETY_DAYS]: []
  };
  for (const i in dates) {
    if (dates.hasOwnProperty(i)) {
      const date = dates[i];
      const start = new Date(date.start).setUTCHours(0, 0, 0);
      const end = new Date(date.end).setUTCHours(23, 59, 59);

      res[i] = await CustomerModel.find({
        userId: id,
        parentId: parentId || id,
        isDeleted: false,
        createdAt: {
          $gte: start,
          $lte: end
        }
      }).select("_id");
    }
  }
  let actualResult = {};
  for (const key in res) {
    if (res.hasOwnProperty(key)) {
      const element = res[key];
      actualResult[key] = [];
      element.forEach(e => {
        actualResult[key].push(e._id);
      });
    }
  }
  return actualResult;
};
/**
 *
 */
const customerSales = async (req, res) => {
  try {
    const { currentUser, query } = req;
    const { id, parentId } = currentUser;
    let { start, end } = query;
    start = new Date(new Date(start).setUTCHours(0, 0, 0));
    end = new Date(new Date(end).setUTCHours(23, 59, 59));
    const customers = await getCustomers(id, parentId);
    let resp = {};
    let invoiceTotal = {};
    for (const i in customers) {
      if (customers.hasOwnProperty(i)) {
        const cust = customers[i];
        const condition = {
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
              customerId: {
                $in: cust
              }
            },
            {
              createdAt: {
                $gte: start,
                $lte: end
              }
            },
            {
              isInvoice: true
            }
          ]
        };
        resp[i] = await OrderModel.countDocuments(condition);
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
                  customerId: {
                    $in: cust
                  }
                },
                {
                  createdAt: {
                    $gte: start,
                    $lte: end
                  }
                },
                {
                  isInvoice: true
                }
              ]
            }
          },
          {
            $lookup: {
              from: "paymentrecords",
              localField: "paymentId",
              foreignField: "_id",
              as: "payments"
            }
          },
          {
            $unwind: "$payments"
          },
          {
            $unwind: "$payments.payedAmount"
          },
          {
            $group: {
              _id: null,
              sum: { $sum: "$payments.payedAmount.amount" }
            }
          }
        ]);
        invoiceTotal[i] = 0;
        invoice.forEach(inv => {
          invoiceTotal[i] = invoiceTotal[i] + inv.sum;
        });
      }
    }
    return res.status(200).json({
      data: { invoices: resp, invoiceTotal },
      message: "Data feched successfully."
    });
  } catch (error) {
    console.log("Error while fetching customer sales", error);
    return res.status(500).json({
      message: "We are having an error."
    });
  }
};
/**
 *
 */
module.exports = { getOverview, customerSales, getDateRanges };
