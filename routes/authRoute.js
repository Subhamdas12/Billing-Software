const express = require("express");
const {
  createUser,
  loginUser,
  checkUser,
  createUserTemp,
  logoutUser,
} = require("../controllers/authController");
const passport = require("passport");
const router = express.Router();
router
  .get("/checkUser", passport.authenticate("jwt"), checkUser)
  .get("/logoutUser", logoutUser)
  .post("/loginUser", passport.authenticate("local"), loginUser)
  .post("/createUser", passport.authenticate("jwt"), createUser)
  .post("/createUserTemp", createUserTemp);
exports.router = router;
