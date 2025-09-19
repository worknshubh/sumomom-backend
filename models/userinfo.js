const mongoose = require("mongoose");
const userinfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  currentAge: { type: Number, required: true },
  userHeight: { type: Number, required: true },
  prePregnancyWeight: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  lastMensturalPeriod: { type: Date, required: true },
  numberOfPregnancies: { type: Number, required: true },
  userDiet: { type: String, required: true },
  userAllergies: { type: String, required: true },
  userOccupation: { type: String, required: true },
  userPhysicalActivity: { type: String, required: true },
  password: { type: String, require: true },
  userImage: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userinfoSchema);

module.exports = User;
