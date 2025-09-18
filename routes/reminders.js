const express = require("express");
const { reminderAdd } = require("../contollers/remindersController");
const router = express();

router.post("/addreminder", reminderAdd);

module.exports = router;
