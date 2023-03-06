const PaymentRecordModel = require("./../../models/paymentRecord");
const OrderModel = require("./../../models/order");
const mongoose = require("mongoose");

const addNewPaymentRecord = async (req, res) => {
   const { body, currentUser } = req;
   try {
      const paymentData = {
         paymentType: body.paymentType,
         paymentDetails: body.paymentDetails,
         payedAmount: body.payedAmount,
         remainingAmount: body.remainingAmount,
         isFullyPaid: body.isFullyPaid,
         customerId: mongoose.Types.ObjectId(body.customerId),
         orderId: mongoose.Types.ObjectId(body.orderId),
         userId: mongoose.Types.ObjectId(currentUser.id),
         parentId: mongoose.Types.ObjectId(currentUser.parentId ? currentUser.parentId : currentUser.id)
      }
      const payment = new PaymentRecordModel(paymentData);
      await payment.save();
      const payload = [payment._id]
      await OrderModel.update(
         { _id: body.orderId },
         {
            $push: {
               paymentId: payload
            },
            remainingAmount:body.remainingAmount
         }
      )
      return res.status(200).json({
         message: "Payment recored successfully.",
         success: true
      })
   } catch (error) {
      return res.status(500).json({
         message: error.message ? error.message : "Unexpected error occure.",
         success: false
      });
   }
}

module.exports = {
   addNewPaymentRecord
}