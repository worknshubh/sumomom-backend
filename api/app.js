const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const cookieParser = require("cookie-parser");
const authRoute = require("../routes/auth");
const homeRoute = require("../routes/aihomeresponse");
const trackerRoute = require("../routes/tracker");
const userRoute = require("../routes/user");
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
app.use("/api/auth", authRoute);
app.use("/api/home", homeRoute);
app.use("/api/tracker", trackerRoute);
app.use("/api/user", userRoute);
module.exports = app;
