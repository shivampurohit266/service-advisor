const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeClockSchema = new Schema({
  type: {
    type: String,
    default: null
  },
  technicianId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "service",
    default: null
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },
  startDateTime: {
    type: Date,
    default: null
  },
  endDateTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  activity: {
    type: String,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: null
  },
  total: {
    type: Number,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
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
});

module.exports = mongoose.model("TimeClock", timeClockSchema);
