const express = require("express");
const { HomePageResponse } = require("../contollers/airesponses");
const router = express.Router();

router.get("/", HomePageResponse);

module.exports = router;
