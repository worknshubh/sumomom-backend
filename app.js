const express = require("express");
const mongoose = require("mongoose");
const { PORT, MONGODB_URL } = require("./keys");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const homeRoute = require("./routes/aihomeresponse");
const trackerRoute = require("./routes/tracker");
const app = express();
mongoose.connect(MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB");
  app.listen(PORT, () => {
    console.log("Server Started");
  });
});
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Server Running");
});
app.use("/auth", authRoute);
app.use("/home", homeRoute);
app.use("/tracker", trackerRoute);
