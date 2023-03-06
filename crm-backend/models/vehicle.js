const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  notes: {
    type: String,
    default: null
  },
  year: {
    type: String,
    default: null
  },
  make: {
    type: String,
    default: null
  },
  modal: {
    type: String,
    default: null
  },
  type: {
    type: Object,
    default: null
  },
  miles: {
    type: String,
    default: null
  },
  color: {
    type: Object,
    default: null
  },
  licensePlate: {
    type: String,
    default: null
  },
  unit: {
    type: String,
    default: null
  },
  vin: {
    type: String,
    default: null
  },
  subModal: {
    type: String,
    default: null
  },
  engineSize: {
    type: String,
    default: null
  },
  productionDate: {
    type: String,
    default: null
  },
  transmission: {
    type: String,
    default: null
  },
  drivetrain: {
    type: String,
    default: null
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model("vehicle", vehicleSchema);
