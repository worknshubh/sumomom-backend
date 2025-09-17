const express = require("express");
const { getuserdata } = require("../contollers/userController");
const router = express();

router.get("/getuserdata", getuserdata);

module.exports = router;
