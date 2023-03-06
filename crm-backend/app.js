const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongoose");
const { mode } = require("./config/app");
const path = require("path");

global.timeClocks = {};

app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));

if (mode === "development") {
  const cors = require("cors");
  var corsOption = {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    exposedHeaders: ["x-auth-token", "authorization"]
  };
  app.use(cors(corsOption));
}
app.use(express.static(path.join(__dirname, "build")));
let url = "mongodb://localhost:27017/crm360";
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
});

const apiApiRoutes = require("./routes/apiRoutes/apiRoutes");
app.use("/api", apiApiRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
const port = process.env.PORT || 8009;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

module.exports = app;
