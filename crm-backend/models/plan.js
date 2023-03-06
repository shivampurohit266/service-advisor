const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const planSchema = new Schema({
  name: {
    type: String
  },
  stripeId: {
    type: String
  },
  amount: {
    type: Number
  },
  facilities: {
    type: new Schema({
      noOfLiscence: { type: Number, default: 1 },
      workFlowManagement: { type: Boolean, default: false },
      quoteAndInvoices: { type: Number, default: 0 },
      payments: { type: Boolean, default: false },
      smsAndEmail: { type: Number, default: 0 },
      inventoryManagement: { type: Boolean, default: false },
      empRecordAndSchedule: { type: Boolean, default: false },
      timeclock: { type: Boolean, default: false },
      reportings: { type: Boolean, default: false },
      emailAutomation: { type: Boolean, default: false }
    })
  },
  planStripeDetails: Object,
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = Mongoose.model("plan", planSchema);
