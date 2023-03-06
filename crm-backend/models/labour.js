const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionObject = require("./commonPermission");

const labourSchema = new Schema({
    discription: {
        type: String,
        default: null
    },
    hours: {
        type: String,
        default: null
    },
    rate: {
        type: Schema.Types.ObjectId,
        ref: "RateStandard",
        default: null,
    },
    discount: {
        type: Object,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    permission: {
        type: PermissionObject,
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

module.exports = mongoose.model("Labour", labourSchema);
