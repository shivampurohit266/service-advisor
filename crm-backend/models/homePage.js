const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homePageSchema = new Schema({
    title: {
        type: String,
        default: null
    },
    section1: {
        type: Array,
        default: []
    },
    section2Title :{
        type: String,
        default: null
    },
    section2: {
        type: Array,
        default: []
    },
    section3: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("homepage", homePageSchema);