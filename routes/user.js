const express = require("express");
const {
  getuserdata,
  getuserweightinfo,
  getuserkickdata,
} = require("../contollers/userController");
const router = express();

router.get("/getuserdata", getuserdata);
router.get("/getuserweightinfo", getuserweightinfo);
router.get("/getuserkickdata", getuserkickdata);
module.exports = router;
