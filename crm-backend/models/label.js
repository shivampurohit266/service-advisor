const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    labelName: {
        type: String,
        default: null
    },
    labelColor: {
        type: String,
        default: null
    },
    isSavedLabel: {
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

module.exports = mongoose.model("Label", labelSchema);
