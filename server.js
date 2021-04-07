const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const AWS = require("aws-sdk");
const { getPosts, addPosts, deletePost } = require("./dynamo");
const upload = require("./awsConfig");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const app = express();
console.log(`Logged on ${new Date().toLocaleTimeString()}`);
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  bodyParser.json(),
);

app.get("/getposts", async (req, res) => {
  const posts = await getPosts();
  res.send(posts);
});

app.post("/addpost", async (req, res) => {
  const add = await addPosts(req.body);
  res.send(add);
});

app.delete("/delete/:id", async (req, res) => {
  await deletePost(req.params.id);
  res.send("deleted");
});

const singleUpload = upload.single("image");

app.post("/upload", singleUpload, function (req, res) {
  res.send(req.file.location);
});

app.use(express.static("client/build"));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
