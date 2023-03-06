const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  instagram: {
    type: String
  },
  linkedin: {
    type: String
  },
  email: {
    type: String
  },
  support_email: {
    type: String
  },
  website: {
    type: String
  },
  contact: {
    type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updateBy: {
    type: mongoose.Types.ObjectId,
    default: null
  }
});

module.exports = mongoose.model("setting", settingSchema);
