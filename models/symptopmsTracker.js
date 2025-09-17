const mongoose = require("mongoose");
const symptomsTrackerSchema = new mongoose.Schema({
  sumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Data: [
    {
      symptomName: {
        type: String,
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

const symptomsTrackerModel = mongoose.model(
  "symptomsTrackerLog",
  symptomsTrackerSchema
);

module.exports = symptomsTrackerModel;
