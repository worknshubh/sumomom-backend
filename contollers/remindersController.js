const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/userinfo");
const reminderModel = require("../models/quickReminders");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reminderAdd = async (req, res) => {
  const token = req.cookies.token;
  const { reminder } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      const remData = await reminderModel.findOne({
        sumoMomId: userData._id,
      });
      if (remData) {
        remData.Data.push({
          reminder: reminder,
        });
        await remData.save();
      } else {
        reminderModel.create({
          sumoMomId: userData._id,
          Data: [
            {
              reminder: reminder,
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

const fetchReminders = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_SECRET_KEY);
      const userData = await User.findOne({
        _id: tokenData.id,
      });
      const remData = await reminderModel.findOne({
        sumoMomId: userData._id,
      });

      return res.json({
        msg: "Fetched Successfully",
        data: remData,
      });
    } catch (error) {
      return res.json({ msg: error.message, success: false });
    }
  } else {
    return res.json({ msg: "Unauthorized User ", success: false });
  }
};
module.exports = { reminderAdd, fetchReminders };
