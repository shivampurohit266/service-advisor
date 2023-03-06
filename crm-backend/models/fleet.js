const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionObject = require("./commonPermission");
const fleetSchema = new Schema({
  companyName: {
    type: String,
    default: null
  },
  phoneDetail: {
    type: [Object],
    default: null
  },
  email: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  address1: {
    type: String,
    default: null
  },
  address2: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  zipCode: {
    type: String,
    default: null
  },
  fleetDefaultPermissions: {
    type: PermissionObject,
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
  status: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Fleet", fleetSchema);
