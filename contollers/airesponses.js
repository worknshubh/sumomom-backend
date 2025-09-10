const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET_KEY, GEMINI_API_KEY } = require("../keys");
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
                 - babySize (string like "lemon", "apple")
                 - tipOftheWeek (one helpful pregnancy tip in one sentence)
    `;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      let text = result.response.text().trim();
      text = text.replace(/```json|```/g, "").trim();

      const jsonResponse = JSON.parse(text);

      const saveinAIhome = await AIresponseHome.findOne({
        SumoMomId: tokenData.id,
      });
      if (saveinAIhome) {
        saveinAIhome.currentWeek = currentWeek;
        saveinAIhome.currentTrimester = jsonResponse.currentTrimester;
        saveinAIhome.babySize = jsonResponse.babySize;
        saveinAIhome.tipOftheWeek = jsonResponse.tipOftheWeek;
        saveinAIhome.lastUpdated = Date.now();
        await saveinAIhome.save();
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
      return res.json({ success: true, data: jsonResponse });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User", success: false });
  }
};

module.exports = { HomePageResponse };
