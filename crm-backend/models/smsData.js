const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smsDataSchema = new Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  message: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  detailObject: {
    type: Object
  },
  status: {
    type: String
  }
});

module.exports = mongoose.model("smsDetail", smsDataSchema);
