const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
   serviceName: {
      type: String,
      default: null,
   },
   note: {
      type: String,
      default: null,
   },
   customerComment: {
      type: String,
      default: null
   },
   userRecommendations: {
      type: String,
      default: null
   },
   orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order"
   },
   technician: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
   },
   serviceItems: {
      type: [Object],
      default: []
   },
   epa: {
      type: Object,
      default: null
   },
   discount: {
      type: Object,
      default: null
   },
   taxes: {
      type: Object,
      default: null
   },
   serviceTotal: {
      type: Number,
      default: null
   },
   isConfirmedValue: {
      type: Object,
      default: null
   },
   serviceSubTotalValue: {
      type: [Number],
      default: []
   },
   isCannedService: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Service", serviceSchema);
