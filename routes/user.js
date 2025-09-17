const express = require("express");
const {
  getuserdata,
  getuserweightinfo,
} = require("../contollers/userController");
const router = express();

router.get("/getuserdata", getuserdata);
router.get("/getuserweightinfo", getuserweightinfo);
module.exports = router;
