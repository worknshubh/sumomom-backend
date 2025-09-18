const express = require("express");
const {
  reminderAdd,
  fetchReminders,
  deleteReminder,
} = require("../contollers/remindersController");
const router = express();

router.post("/addreminder", reminderAdd);
router.get("/fetchreminders", fetchReminders);
router.post("/deletereminder", deleteReminder);
module.exports = router;
