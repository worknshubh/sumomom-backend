const jsonwebtoken = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const User = require("../models/userinfo");
const moment = require("moment");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIresponseHome = require("../models/aihomeresponse");
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const HomePageResponse = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const user = await User.findOne({
        _id: tokenData.id,
      });
      const lmp = moment(user.lastMensturalPeriod);
      const now = moment();
      const saveinAIhome = await AIresponseHome.findOne({
        SumoMomId: tokenData.id,
      });
      const currentWeek = now.diff(lmp, "weeks");
      const prompt = `you have input fields : 
            fullName : ${user.fullName} ,
            currentAge : ${user.currentAge},
            userHeight : ${user.userHeight},
            prePregnancyWeight: ${user.prePregnancyWeight},
            currentWeight : ${user.currentWeight}.
            currentPregnancyWeek : ${currentWeek},
            userDiet:${user.userDiet},
            userAllergies:${user.userAllergies}

            you have to generate following output in json format
                 - currentTrimester (1, 2, or 3)
                 - babySize (string: choose only from ["lemon", "apple", "mango", "banana", "grape", "peach", "pear", "watermelon", "pumpkin", "papaya"])
                 - tipOftheWeek (one helpful pregnancy tip in one line within 7-8 words)
    `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      let text = result.response.text().trim();
      text = text.replace(/```json|```/g, "").trim();

      const jsonResponse = JSON.parse(text);

      if (saveinAIhome) {
        saveinAIhome.set({
          currentWeek: currentWeek,
          currentTrimester: jsonResponse.currentTrimester,
          babySize: jsonResponse.babySize,
          tipOftheWeek: jsonResponse.tipOftheWeek,
          lastUpdated: Date.now(),
        });
      } else {
        AIresponseHome.create({
          SumoMomId: tokenData.id,
          currentWeek: currentWeek,
          currentTrimester: jsonResponse.currentTrimester,
          babySize: jsonResponse.babySize,
          tipOftheWeek: jsonResponse.tipOftheWeek,
          lastUpdated: Date.now(),
        });
      }

      const temp = user.fullName.split(" ");
      const firstName = temp[0];
      return res.json({
        success: true,
        data: jsonResponse,
        currentWeek: currentWeek,
        firstName: firstName,
      });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User", success: false });
  }
};

module.exports = { HomePageResponse };
