const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema({
  sumoMomId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Data: [
    {
      reminder: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const reminderModel = mongoose.model("reminderLog", reminderSchema);

module.exports = reminderModel;
