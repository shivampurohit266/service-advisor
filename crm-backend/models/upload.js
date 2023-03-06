const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    type: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    originalImage: {
        type: String,
        default: null
    },
    thumbnailImage: {
        type: String,
        default: null
    }
    ,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("upload", uploadSchema);
