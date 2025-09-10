const mongoose = require("mongoose");
const kickTrackerSchema = new mongoose.Schema({
  sumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Data: [
    {
      kickCount: {
        type: Number,
        required: true,
      },
      userNotes: {
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

const kickTrackerModel = mongoose.model("kickTrackerLog", kickTrackerSchema);

module.exports = kickTrackerModel;
