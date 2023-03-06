const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    userType: {
        type: String,
        default: null
    },
	permissionObject: {
		type: Object,
		default: null
	}
});

module.exports = mongoose.model("role", roleSchema);