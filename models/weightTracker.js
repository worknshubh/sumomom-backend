const mongoose = require("mongoose");
const weightTrackerSchema = new mongoose.Schema({
  sumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Data: [
    {
      updatedWeight: {
        type: Number,
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

const weightTrackerModel = mongoose.model(
  "weightTrackerLog",
  weightTrackerSchema
);

module.exports = weightTrackerModel;
