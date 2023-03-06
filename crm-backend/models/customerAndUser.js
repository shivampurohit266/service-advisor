const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerAndUserSchema = new Schema({
    customerComment: {
        type: String,
        default: null
    },
    userRecommendations: {
        type: String,
        default: null
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
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

module.exports = mongoose.model("CustomerAndUser", customerAndUserSchema);
