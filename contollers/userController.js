const User = require("../models/userinfo");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../keys");
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
        res.cookie("token", token);
        return res.json({ msg: "Login Successfull", success: true });
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

module.exports = { userSignup, userSignin };
