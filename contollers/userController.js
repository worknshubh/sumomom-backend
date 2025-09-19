const User = require("../models/userinfo");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const weightTrackerModel = require("../models/weightTracker");
const kickTrackerModel = require("../models/kickCouterTracker");
const moodTrackerModel = require("../models/moodTracker");
const symptomsTrackerModel = require("../models/symptopmsTracker");
const moment = require("moment");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const userSignup = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      password,
      currentAge,
      userHeight,
      prePregnancyWeight,
      currentWeight,
      lastMensturalPeriod,
      numberOfPregnancies,
      userDiet,
      userAllergies,
      userOccupation,
      userPhysicalActivity,
    } = req.body;

    const hashedpassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName: fullName,
      mobileNumber: mobileNumber,
      currentAge: currentAge,
      userHeight: userHeight,
      prePregnancyWeight: prePregnancyWeight,
      currentWeight: currentWeight,
      lastMensturalPeriod: lastMensturalPeriod,
      numberOfPregnancies: numberOfPregnancies,
      userDiet: userDiet,
      userAllergies: userAllergies,
      userOccupation: userOccupation,
      userPhysicalActivity: userPhysicalActivity,
      password: hashedpassword,
    });

    return res.json({ msg: "User Created Successfully", success: true });
  } catch (error) {
    return res.json({ msg: error.message, success: false });
  }
};

const userSignin = async (req, res) => {
  const { mobileNumber, password } = req.body;
  try {
    const UserData = await User.findOne({ mobileNumber: mobileNumber });
    if (UserData) {
      const unhashed_pass = await bcrypt.compare(password, UserData.password);
      if (unhashed_pass) {
        const token = jsonwebtoken.sign({ id: UserData._id }, JWT_SECRET_KEY);
        res.cookie("token", token, {
          httpOnly: false,
          sameSite: "none",
          secure: true,
        });
        return res.json({
          msg: "Login Successfull",
          success: true,
          token: token,
        });
      } else {
        return res.json({
          msg: "Invaild UserNumber or Password",
          success: false,
        });
      }
    } else {
      return res.json({
        msg: "Invaild UserNumber or Password",
        success: false,
      });
    }
  } catch (error) {
    return res.json({ msg: error.message, success: false });
  }
};

const getuserdata = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      return res.json({ msg: "Fetched Successfully", data: userData });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const getuserweightinfo = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const weightData = await weightTrackerModel.findOne({
        sumoMomId: tokenData.id,
      });
      return res.json({ msg: "Fetched Successfully", data: weightData });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const getuserkickdata = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const kickData = await kickTrackerModel.findOne({
        sumoMomId: tokenData.id,
      });
      return res.json({
        msg: "Fetched Successfully",
        data: kickData,
        curr_date: moment().format("YYYY-MM-DD"),
      });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({
      msg: "Unauthorized User ",
      success: false,
    });
  }
};

const getusermooddata = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const moodData = await moodTrackerModel.findOne({
        sumoMomId: tokenData.id,
      });
      return res.json({ msg: "Fetched Successfully", data: moodData });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const getusersymptomsdata = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const symptomsData = await symptomsTrackerModel.findOne({
        sumoMomId: tokenData.id,
      });
      return res.json({ msg: "Fetched Successfully", data: symptomsData });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const updateuserdata = async (req, res) => {
  const token = req.cookies.token;
  const {
    fullName,
    mobileNumber,
    currentAge,
    userHeight,
    prePregnancyWeight,
    userOccupation,
    userPhysicalActivity,
    userDiet,
  } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findByIdAndUpdate(tokenData.id, {
        fullName: fullName,
        mobileNumber: mobileNumber,
        currentAge: currentAge,
        userHeight: userHeight,
        prePregnancyWeight: prePregnancyWeight,
        userOccupation: userOccupation,
        userPhysicalActivity: userPhysicalActivity,
        userDiet: userDiet,
      });

      await userData.save();

      return res.json({ msg: "Updated Successfully", success: true });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

module.exports = {
  userSignup,
  userSignin,
  getuserdata,
  getuserweightinfo,
  getuserkickdata,
  getusermooddata,
  getusersymptomsdata,
  updateuserdata,
};
