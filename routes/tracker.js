const express = require("express");
const {
  weightTracker,
  moodTracker,
  kickCounter,
} = require("../contollers/trackerControllers");
const router = express.Router();

router.post("/weighttracker", weightTracker);
router.post("/moodtracker", moodTracker);
router.post("/kickcounter", kickCounter);
module.exports = router;
