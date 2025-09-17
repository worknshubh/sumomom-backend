const express = require("express");
const {
  weightTracker,
  moodTracker,
  kickCounter,
  SymptomsTracker,
} = require("../contollers/trackerControllers");
const router = express.Router();

router.post("/weighttracker", weightTracker);
router.post("/moodtracker", moodTracker);
router.post("/kickcounter", kickCounter);
router.post("/symptomstracker", SymptomsTracker);
module.exports = router;
