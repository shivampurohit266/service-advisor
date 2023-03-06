const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageTemplateSchema = new Schema({
    templateName: {
        type: String,
        default: null
    },
    subject: {
        type: String,
        default: null
    },
    messageText: {
        type: String,
        default: null
    },
    pdfAttachment: {
        type: String
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: null,
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

module.exports = mongoose.model("MessageTemplate", messageTemplateSchema);
