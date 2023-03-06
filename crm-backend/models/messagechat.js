const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    isInternalNotes: {
        type: Boolean,
        default: false
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        default: null
    },
    messageData: {
        type: String,
        default: null
    },
    messageAttachment: {
        type: Object,
        default: null
    },
    messageTemplate: {
        type: Object,
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
    isSender: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model("Message", messageSchema);