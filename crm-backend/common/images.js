var multer = require('multer')
const path = require("path");
const { mode } = require("../config/app")

const __basedir = path.join(__dirname, "../public");

// Upload image File using multer
var storageFile = multer.diskStorage({
    destination: function (req, file, callback) {
        if (mode) {
            callback(null, path.join(
                __basedir,
                "/inspection-img"
            ));
        } else {
            callback(null, path.join(
                __basedir,
                "/inspection-img"
            ));
        }
    },
    filename: function (req, file, callback) {
        const { currentUser } = req
        let headToken = currentUser;
        let type = file.mimetype.replace("image/", "");
        callback(null, headToken.id + Date.now() + "inspection_image" + `.${type ? type : "png"}`);
    }
});

module.exports = { storageFile };
