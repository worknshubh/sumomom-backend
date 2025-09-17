const express = require("express");
const {
  getuserdata,
  getuserweightinfo,
  getuserkickdata,
  getusermooddata,
} = require("../contollers/userController");
const router = express();

router.get("/getuserdata", getuserdata);
router.get("/getuserweightinfo", getuserweightinfo);
router.get("/getuserkickdata", getuserkickdata);
router.get("/getusermooddata", getusermooddata);
module.exports = router;
