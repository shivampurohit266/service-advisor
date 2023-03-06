const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentRecordSchema = new Schema({
  paymentType: {
    type: String,
    default: null
  },
  paymentDetails: {
    type: Object,
    default: {}
  },
  payedAmount: {
    type: [
      new Schema({
        amount: {
          type: Number
        },
        date: {
          type: Date,
          default: Date.now
        }
      })
    ]
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    default: null
  },
  isFullyPaid: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);
