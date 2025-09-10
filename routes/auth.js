const express = require("express");
const { userSignup, userSignin } = require("../contollers/userController");
const router = express.Router();

router.post("/user/signup", userSignup);
router.post("/user/signin", userSignin);

module.exports = router;
