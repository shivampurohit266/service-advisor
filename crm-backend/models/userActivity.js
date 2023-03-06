const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userActivitySchema = new Schema({
   name: {
      type: String,
      default: null
   },
   type: {
      type: String,
      default: null
   },
   orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order"
   },
   activityPerson: {
      type: Schema.Types.ObjectId,
      ref: "user"
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

module.exports = mongoose.model("UserActivity", userActivitySchema);
