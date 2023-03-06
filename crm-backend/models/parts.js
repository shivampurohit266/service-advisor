const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partSchema = new Schema({
  description: {
    type: String
  },
  note: {
    type: String
  },
  partNumber: {
    type: String
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "Vendor"
  },
  location: {
    type: String
  },
  priceMatrix: {
    type: Schema.Types.ObjectId,
    ref: "priceMatrix"
  },
  cost: {
    type: Number
  },
  retailPrice: {
    type: Number
  },
  markup: {
    type: Number
  },
  margin: {
    type: Number
  },
  quantity: {
    type: Number
  },
  criticalQuantity: {
    type: Number
  },
  quickBookItem: {
    type: String
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  partOptions: {
    type: new Schema({
      isTaxed: Boolean,
      showNoteOnQuoteAndInvoice: Boolean,
      showNumberOnQuoteAndInvoice: Boolean,
      showPriceOnQuoteAndInvoice: Boolean
    })
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
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

module.exports = mongoose.model("part", partSchema);
