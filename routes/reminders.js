const express = require("express");
const {
  reminderAdd,
  fetchReminders,
} = require("../contollers/remindersController");
const router = express();

router.post("/addreminder", reminderAdd);
router.get("/fetchreminders", fetchReminders);
module.exports = router;
