const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderStatusSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  parentId: {
    type: Schema.Types.ObjectId,
    default: null
  },
  isInvoice: {
    type: Boolean,
    default: false
  },
  orderIndex: {
    type: Number,
    default: 0
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

module.exports = mongoose.model("orderStatus", orderStatusSchema);
