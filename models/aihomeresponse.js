const mongoose = require("mongoose");
const airesponsehomeSchema = new mongoose.Schema({
  SumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  currentWeek: {
    type: Number,
    required: true,
  },
  currentTrimester: {
    type: Number,
    required: true,
  },
  babySize: {
    type: String,
    required: true,
  },
  tipOftheWeek: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: String,
    required: true,
  },
});

const AIresponseHome = mongoose.model("AIresponseHome", airesponsehomeSchema);

module.exports = AIresponseHome;
