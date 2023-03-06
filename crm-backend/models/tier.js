const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionObject = require("./commonPermission");
const tierSchema = new Schema({
  brandName: {
    type: String,
    default: null
  },
  modalName: {
    type: String,
    default: null
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    default: null
  },
  seasonality: {
    type: String,
    default: null
  },
  tierSize: {
    type: [
      new Schema({
        baseInfo: String,
        bin: String,
        cost: Number,
        criticalQuantity: Number,
        margin: Number,
        markup: Number,
        notes: String,
        part: String,
        priceMatrix: {
          type: Schema.Types.ObjectId,
          ref: "priceMatrix"
        },
        quantity: Number,
        retailPrice: Number
      })
    ],
    default: {}
  },
  tierPermission: {
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

module.exports = mongoose.model("Tier", tierSchema);
