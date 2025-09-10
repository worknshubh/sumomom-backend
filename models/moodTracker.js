const mongoose = require("mongoose");
const moodTrackerSchema = new mongoose.Schema({
  sumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Data: [
    {
      userMood: {
        type: String,
        required: true,
      },
      userNotes: {
        type: String,
        required: true,
      },
      aiTip: {
        type: String,
        required: true,
      },
      lastUpdatedDate: {
        type: String,
        required: true,
      },
    },
  ],
});

const moodTrackerModel = mongoose.model("moodTrackerLog", moodTrackerSchema);

module.exports = moodTrackerModel;
