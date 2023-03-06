const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: config.s3Key,
  secretAccessKey: config.s3Secret,
});
const s3 = new AWS.S3();

class awsImageUpload {
  imagePath = await new Promise(resolve => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
        resolve(null);
      }
      resolve(data.Location);
    });
  });
}