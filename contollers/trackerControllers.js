const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const User = require("../models/userinfo");
const weightTrackerModel = require("../models/weightTracker");
const moodTrackerModel = require("../models/moodTracker");
const kickTrackerModel = require("../models/kickCouterTracker");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const AIresponseHome = require("../models/aihomeresponse");

const weightTracker = async (req, res) => {
  const token = req.cookies.token;
  const { updatedWeight, userNotes } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      const WeightData = await weightTrackerModel.findOne({
        sumoMomId: userData._id,
      });
      const aiHomeresponse = await AIresponseHome.findOne({
        SumoMomId: userData._id,
      });
      const prompt = `you are pregnancy tracker assistant and this is user data: 
        current Weight : ${updatedWeight},
        current Age: ${userData.currentAge},
        pre pregnancy weight : ${userData.prePregnancyWeight},
        current pregancy week : ${aiHomeresponse.currentWeek},

        you just have to give one line small 7-8 words tip accordingly for her weight change
        
        `;
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const result = await model.generateContent(prompt);
      //   console.log(result.response.text());
      if (WeightData) {
        WeightData.Data.push({
          updatedWeight: updatedWeight,
          userNotes: userNotes,
          lastUpdatedDate: lastUpdatedDate,
          aiTip: result.response.text(),
        });
        await WeightData.save();
        userData.currentWeight = updatedWeight;
        await userData.save();
      } else {
        await weightTrackerModel.create({
          sumoMomId: userData._id,
          Data: [
            {
              updatedWeight: updatedWeight,
              userNotes: userNotes,
              lastUpdatedDate: lastUpdatedDate,
              aiTip: result.response.text(),
            },
          ],
        });
      }

      return res.json({ msg: "Updated Successfully ", success: true });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const moodTracker = async (req, res) => {
  const token = req.cookies.token;
  const { userMood, userNotes } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({ _id: tokenData.id });
      const moodData = await moodTrackerModel.findOne({
        sumoMomId: userData._id,
      });
      const aiHomeresponse = await AIresponseHome.findOne({
        SumoMomId: userData._id,
      });
      const prompt = `you are pregnancy tracker assistant and this is user data: 
        current Weight : ${userData.currentWeight},
        current Age: ${userData.currentAge},
        pre pregnancy weight : ${userData.prePregnancyWeight},
        current pregancy week : ${aiHomeresponse.currentWeek},
        current Mood : ${userMood},
        user Personal Note :${userNotes}
        you just have to give one line tip according to her mood which should be best for her and baby.
        
        `;
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const result = await model.generateContent(prompt);

      if (moodData) {
        moodData.Data.push({
          userMood: userMood,
          userNotes: userNotes,
          aiTip: result.response.text(),
          lastUpdatedDate: moment().format("YYYY-MM-DD"),
        });

        await moodData.save();
      } else {
        await moodTrackerModel.create({
          sumoMomId: userData._id,
          Data: [
            {
              userMood: userMood,
              userNotes: userNotes,
              aiTip: result.response.text(),
              lastUpdatedDate: moment().format("YYYY-MM-DD"),
            },
          ],
        });
      }
      return res.json({ msg: "Updated Successfully ", success: true });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};

const kickCounter = async (req, res) => {
  const token = req.cookies.token;
  const { userNotes, kickCount } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      const kickData = await kickTrackerModel.findOne({
        sumoMomId: userData._id,
      });
      if (kickData) {
        kickData.Data.push({
          kickCount: kickCount,
          userNotes: userNotes,
          lastUpdatedDate: moment().format("YYYY-MM-DD"),
        });
        await kickData.save();
      } else {
        await kickTrackerModel.create({
          sumoMomId: userData._id,
          Data: [
            {
              kickCount: kickCount,
              userNotes: userNotes,
              lastUpdatedDate: lastUpdatedDate,
            },
          ],
        });
      }
      return res.json({ msg: "Updated Successfully ", success: true });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};
module.exports = { weightTracker, moodTracker, kickCounter };
