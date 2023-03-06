const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phoneNumberObject = new Schema({
  phone: {
    type: String
  },
  value: {
    type: String
  }
});

const CommanPersonObject = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: phoneNumberObject,
  },
});

const AddressObject = new Schema({
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  }
})

module.exports = { CommanPersonObject, AddressObject };
