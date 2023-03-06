const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderName: {
    type: String,
    default: null
  },
  orderId: {
    type: Number,
    default: null
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    default: null
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: "vehicle",
    default: null
  },
  serviceId: {
    type: [
      new Schema({
        serviceId: {
          type: Schema.Types.ObjectId,
          ref: "Service"
        }
      })
    ],
    default: []
  },
  inspectionId: {
    type: [
      new Schema({
        inspectionId: {
          type: Schema.Types.ObjectId,
          ref: "Inspection"
        }
      })
    ],
    default: []
  },
  customerCommentId: {
    type: Schema.Types.ObjectId,
    ref: "CustomerAndUser",
    default: null
  },
  timeClockId: [
    {
      type: Schema.Types.ObjectId,
      ref: "TimeClock"
    }
  ],
  paymentId: [
    {
      type: Schema.Types.ObjectId,
      ref: "PaymentRecord"
    }
  ],
  messageId: {
    type: [
      new Schema({
        messageId: {
          type: Schema.Types.ObjectId,
          ref: "Message"
        }
      })
    ],
    default: []
  },
  invoiceURL: {
    type: String
  },
  inspectionURL: {
    type: String
  },
  isFullyPaid: {
    type: Boolean,
    default: false
  },
  remainingAmount: {
    type: Number
  },
  orderTotal: {
    type: Number
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
  workflowStatus: {
    type: Schema.Types.ObjectId,
    ref: "orderStatus",
    default: null
  },
  orderIndex: {
    type: Number
  },
  status: {
    type: Boolean,
    default: false
  },
  isInvoice: {
    type: Boolean,
    default: false
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
  },
  poNumber: {
    type: String,
    default:null
  }
});

module.exports = mongoose.model("Order", orderSchema);
