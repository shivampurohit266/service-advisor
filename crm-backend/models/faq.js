const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const faqSchema = new Schema({
    question: {
        type: String,
        default: null
    },
    answer: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model("faq", faqSchema);
