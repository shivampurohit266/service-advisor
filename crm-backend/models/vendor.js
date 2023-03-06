const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { CommanPersonObject, AddressObject } = require("./vendorCommanObject")
const vendorSchema = new Schema({
    name: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
    accountNumber: {
        type: String,
        default: null
    },
    contactPerson: {
        type: CommanPersonObject,
        default: null
    },
    address: {
        type: AddressObject,
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

module.exports = mongoose.model("Vendor", vendorSchema);
