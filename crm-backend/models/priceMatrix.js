const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pricematrixSchema = new Schema({
   matrixName: {
      type: String,
      default: null
   },
   matrixRange: {
      type: [Object],
      default: null
   },
   parentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
   },
   userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
   },
   status: {
      type: Boolean,
      default: false
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   }
});

module.exports = mongoose.model("priceMatrix", pricematrixSchema);