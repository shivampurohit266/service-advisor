const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const appointmentSchema = new Schema({
  appointmentTitle: {
    type: String,
    required: true
  },
  appointmentColor: {
    type: String
  },
  appointmentDate: {
    type: Date
  },
  customerId: {
    type: ObjectId,
    ref: "Customer",
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  note: {
    type: String
  },
  vehicleId: {
    type: ObjectId,
    ref: "vehicle"
  },
  orderId: {
    type: ObjectId,
    ref: "Order"
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  sendEmail: {
    type: Boolean,
    default: true
  },
  sendMessage: {
    type: Boolean,
    default: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  techinicians: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("appointment", appointmentSchema);
