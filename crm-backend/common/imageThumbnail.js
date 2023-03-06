const Jimp = require("jimp");
const { s3Key } = require("../config/app");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: s3Key.keyId,
  secretAccessKey: s3Key.key
});
const s3 = new AWS.S3();
var bucketName = "service-advisor";

const resizeImage = async (sourcePath, destinationPath, width) => {
  return new Promise((resolve, reject) => {
    Jimp.read(sourcePath, function (err, lenna) {
      if (err) {
        console.log("*********** Resize Error =>", err);
        reject(new Error(err));
      }
      lenna
        .resize(width, Jimp.AUTO)
        .quality(100)
        .write(destinationPath); // save

      resolve(destinationPath);
    });
  });
};

const imagePath = async (imageRoute, fileName, folderPath) => {
  let imageUrl
  var params = {
    Bucket: bucketName,
    Body: fs.createReadStream(imageRoute),
    Key: folderPath === "pdf-file" || folderPath === "message-pdf" ? `${folderPath}/`+ path.basename(fileName) : `${folderPath}/` + Date.now() + "_" + path.basename(fileName),
    ContentType: folderPath === "pdf-file" || folderPath === "message-pdf" ? 'application/pdf' : 'image/jpeg',
    ContentDisposition: `inline; filename=${fileName}`,
    ACL: "public-read"
  };

  await new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        reject(new Error(err));
      }
      resolve(data.Location);
      if (data) {
        imageUrl = data.Location
      } else {
        imageUrl = ""
      }
    });
  });
  return imageUrl
};

module.exports = {
  resizeImage,
  imagePath
};
