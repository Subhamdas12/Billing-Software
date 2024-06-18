const { User } = require("../models/userModel");

exports.fetchUser = async (req, res) => {
  try {
    const user = await User.find({}).exec();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
