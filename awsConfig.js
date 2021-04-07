const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "adsapp",
    acl: "public-read",
    metadata: (req, res, cb) => {
      cb(null, { fieldName: "Item" });
    },
    key: (req, res, cb) => {
      cb(null, String(new Date().getTime()));
    },
  }),
});

module.exports = upload;
