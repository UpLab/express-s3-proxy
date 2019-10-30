const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
const multerS3 = require("multer-s3");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// // put the HTML file containing your form in a directory named "public" (relative to where this script is located)
// app.get("/", express.static(path.join(__dirname, "./public")));

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_BUCKET_REGION;
const bucket = process.env.AWS_BUCKET;

console.log({ accessKeyId, secretAccessKey, region, bucket });

aws.config.update({
  secretAccessKey,
  accessKeyId,
  region
});

const s3 = new aws.S3();

app.use(bodyParser.json());

const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    key: function(req, file, cb) {
      cb(null, file.originalname); //use Date.now() for unique file keys
    }
  })
});

app.post("/file", upload.single("file"), function(req, res, next) {
  res.send("Uploaded!");
});

// app.post('/file', function (req, res, next) {
//   console.log(req);
//   res.send("Uploaded!");
// });
