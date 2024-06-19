require("dotenv").config();
const { sanitizeUser } = require("../helper/services");
const { User } = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      if (!req.body.name || !req.body.phoneNumber || !req.body.password) {
        return res.status(400).json({ message: "Please fill all fields" });
      }
      let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      var salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            res.status(400).json(err);
            console.log(err);
          }
          user = new User({
            ...req.body,
            password: hashedPassword,
            salt,
          });
          const doc = await user.save();
          const userFetch = await User.findById(doc._id)
            .select("-password -salt")
            .exec();
          res.status(200).json(userFetch);
        }
      );
    } else {
      res.status(400).json({ message: "Only Admin can create user" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.createUserTemp = async (req, res) => {
  try {
    if (!req.body.name || !req.body.phoneNumber || !req.body.password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    let user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          res.status(400).json(err);
          console.log(err);
        }
        user = new User({
          ...req.body,
          password: hashedPassword,
          salt,
        });
        const doc = await user.save();

        req.login(sanitizeUser(doc), function (err) {
          if (err) {
            return next(err);
          }
          const token = jwt.sign(
            sanitizeUser(doc),
            process.env.JWT_TOKEN_SECRET
          );
          res
            .cookie("jwt", token, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
              httpOnly: true,
            })
            .status(201)
            .json(sanitizeUser(doc));
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    })
    .status(200)
    .json(sanitizeUser(user));
};
exports.checkUser = (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.sendStatus(400);
  }
};

exports.logoutUser = (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};
