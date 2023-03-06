const AppointmentModal = require("../../models/appointment");
const Orders = require("../../models/order");
const userModel = require("../../models/user");
const customerModel = require("../../models/customer");
const Mongoose = require("mongoose");
const { Email, AvailiableTemplates } = require("../../common/Email");
const { sendSMS } = require("./../../common/SMS");
const moment = require("moment");
/**
 *
 */
const appointmentList = async (req, res) => {
  try {
    const { currentUser, query } = req;
    let { start, end, limit, page } = query;
    page = page || 1;
    const offset = (page - 1) * (limit || 1);
    const { id, parentId } = currentUser;
    const vehicleId = query.vehicleId;
    const customerId = query.customerId;
    const techinicians = query.technicianId;
    const orderId = query.orderId;
    let condition = {};
    condition["$and"] = [
      {
        $or: [
          {
            userId: Mongoose.Types.ObjectId(id)
          },
          {
            parentId: Mongoose.Types.ObjectId(parentId)
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
    if (vehicleId) {
      condition["$and"].push({
        vehicleId: Mongoose.Types.ObjectId(vehicleId)
      });
    }
    if (customerId) {
      condition["$and"].push({
        customerId: Mongoose.Types.ObjectId(customerId)
      });
    }
    if (techinicians) {
      condition["$and"].push({
        techinicians: Mongoose.Types.ObjectId(techinicians)
      });
    }
    if (orderId) {
      condition["$and"].push({
        orderId: Mongoose.Types.ObjectId(orderId)
      });
    }
    if (start) {
      start = new Date(new Date(start).setUTCHours(0, 0, 0, 0));
      condition["$and"].push({
        appointmentDate: {
          $gte: start
        }
      });
    }
    if (end) {
      end = new Date(new Date(end).setUTCHours(23, 59, 59, 999));
      const ind = condition["$and"].findIndex(d => d.appointmentDate);
      if (condition["$and"][ind]) {
        // delete condition["$and"][ind];
        condition["$and"].splice(ind, 1);
      }
      condition["$and"].push({
        appointmentDate: {
          $gte: start,
          $lte: end
        }
      });
    }
    const result = await AppointmentModal.find(condition)
      .populate("customerId vehicleId orderId techinicians")
      .sort({
        appointmentDate: 1
      })
      .skip(offset)
      .limit(parseInt(limit) || 10000);

    res.status(200).json({
      message: "Appointment list successful.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const addAppointment = async (req, res) => {
  try {
    const { body, currentUser } = req;
    const { id, parentId } = currentUser;
    const {
      appointmentTitle,
      selectedColor: appointmentColor,
      appointmentDate,
      selectedCustomer: customerId,
      startTime,
      endTime,
      note,
      selectedVehicle: vehicleId,
      selectedOrder: orderId,
      phone,
      email,
      techinicians,
      isEmail,
      isSms
    } = body;
    const actualStartTime = new Date().setUTCHours(
      parseInt(startTime.split()[0]),
      parseInt(startTime.split(":")[1])
    );
    const actualEndTime = new Date().setUTCHours(
      parseInt(endTime.split()[0]),
      parseInt(endTime.split(":")[1])
    );
    let dataToSave = {
      appointmentTitle,
      appointmentColor,
      appointmentDate,
      customerId,
      startTime: actualStartTime,
      endTime: actualEndTime,
      note,
      phone,
      email,
      sendEmail: isEmail,
      sendMessage: isSms,
      parentId: parentId || id,
      userId: id,
      techinicians
    };
    let Name = "", customerDetails = {}, techniicanEmails = [];
    if (vehicleId) {
      dataToSave.vehicleId = Mongoose.Types.ObjectId(vehicleId);
    }
    if (orderId) {
      dataToSave.orderId = Mongoose.Types.ObjectId(orderId);
      Name = await Orders.findOne({ _id: orderId }, { orderName: 1 });
    }
    if (customerId) {
      customerDetails = await customerModel.findById(customerId)
    }
    if (techinicians && techinicians.length) {
      for (let index = 0; index < techinicians.length; index++) {
        const techData = techinicians[index]
        const element = await userModel.findById(techData)
        techniicanEmails.push(element.email)
      }
    }
    /* notify via sms */
    if (isSms) {
      const smsResult = await sendSMS(phone, appointmentTitle, id);
      if (smsResult.error === true) {
        return res.status(400).json({
          message: smsResult.message.replace("To", "Phone")
        });
      }
    }
    if (isEmail) {
      const result = await userModel.findOne({ _id: id }, { companyName: 1 });
      const emailVar = new Email(body);
      const scheduledDate = moment(appointmentDate).format("lll");
      await emailVar.setSubject(
        "[Service Advisor]" + `Appointment scheduled on ${scheduledDate}`
      );
      const message = `Your appointment has been scheduled for ${appointmentTitle}`;
      await emailVar.setTemplate(AvailiableTemplates.APPOINTMENT, {
        body: message,
        orderTitle: Name.orderId ? `Order (# ${Name.orderId})` : "",
        createdAt: scheduledDate,
        companyName: result.companyName,
        titleMessage: Name.orderId
          ? "Your appointment has been scheduled for"
          : "Your appointment has been scheduled",
        displayStyle: `style="text-align:center; display: none";`,
        customerName: customerDetails
          ? `${customerDetails.firstName}${" "}${customerDetails.lastName}`
          : "User"
      });
      techniicanEmails.push(email)

      await emailVar.sendEmail(techniicanEmails);
    }
    const result = await AppointmentModal.create(dataToSave);
    /* notify via sms */
    res.status(200).json({
      message: "Appointment added successfully.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const getAppointmentDetails = async (req, res) => {
  try {
    const { params, currentUser } = req;
    const { id, parentId } = currentUser;
    const { eventId, technicianId } = params;
    const techinicians = technicianId;
    const details = await AppointmentModal.findOne({
      _id: Mongoose.Types.ObjectId(eventId),
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
              userId: Mongoose.Types.ObjectId(id)
            },
            {
              parentId: Mongoose.Types.ObjectId(parentId)
            }
          ]
        }
      ]
    }).populate("customerId vehicleId orderId techinicians");
    res.status(200).json({
      message: "Appointment details successfully.",
      data: details
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
const updateAppointment = async (req, res) => {
  try {
    const { body, currentUser, params } = req;
    const { eventId: appointmentId } = params;
    const { id, parentId } = currentUser;
    const {
      appointmentTitle,
      selectedColor: appointmentColor,
      appointmentDate,
      selectedCustomer: customerId,
      startTime,
      endTime,
      note,
      selectedVehicle: vehicleId,
      selectedOrder: orderId,
      phone,
      email,
      sendEmail,
      sendMessage,
      techinicians,
      isEmail,
      isSms
    } = body;
    const actualStartTime = new Date().setUTCHours(
      parseInt(startTime.split()[0]),
      parseInt(startTime.split(":")[1])
    );
    const actualEndTime = new Date().setUTCHours(
      parseInt(endTime.split()[0]),
      parseInt(endTime.split(":")[1])
    );
    let dataToSave = {
      appointmentTitle,
      appointmentColor,
      appointmentDate,
      customerId,
      startTime: actualStartTime,
      endTime: actualEndTime,
      note,
      phone,
      email,
      sendEmail,
      sendMessage,
      parentId: parentId || id,
      userId: id,
      techinicians
    };
    let Name = "";
    if (vehicleId) {
      dataToSave.vehicleId = Mongoose.Types.ObjectId(vehicleId);
    }
    if (orderId) {
      dataToSave.orderId = Mongoose.Types.ObjectId(orderId);
      Name = await Orders.findOne({ _id: orderId }, { orderName: 1 });
    }
    if (isSms) {
      const smsResult = await sendSMS(phone, appointmentTitle, id);
      if (smsResult.error === true) {
        return res.status(400).json({
          message: smsResult.message.replace("To", "Phone")
        });
      }
    }
    if (isEmail) {
      const result = await userModel.findOne({ _id: id }, { companyName: 1 });
      const emailVar = new Email(body);
      const scheduledDate = moment(appointmentDate).format("lll");
      await emailVar.setSubject(
        "[Service Advisor]" + `Appointment scheduled on ${scheduledDate}`
      );
      const message = `Your appointment has been scheduled for ${appointmentTitle}`;
      await emailVar.setTemplate(AvailiableTemplates.INSPECTION_TEMPLATE, {
        body: message,
        orderTitle: Name.orderName ? Name.orderName : "Unnamed Order",
        createdAt: scheduledDate,
        companyName: result.companyName,
        titleMessage: "Your appointment has been scheduled for",
        displayStyle: `style="text-align:center; display: none";`
      });
      await emailVar.sendEmail(email);
    }
    const result = await AppointmentModal.updateOne(
      { _id: Mongoose.Types.ObjectId(appointmentId) },
      {
        $set: dataToSave
      }
    );
    /* notify via sms */
    res.status(200).json({
      message: "Appointment updated successfully.",
      data: result
    });
  } catch (error) {
    console.log("this is appointmentList error", error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};
/**
 *
 */
module.exports = {
  appointmentList,
  addAppointment,
  getAppointmentDetails,
  updateAppointment
};
