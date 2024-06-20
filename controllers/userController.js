const { User } = require("../models/userModel");

exports.fetchUser = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const user = await User.find({}).select("-password -salt").exec();
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "Admin") {
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const updateUser = await user.save();
      const element = await User.findById(updateUser.id)
        .select("-password -salt")
        .exec();
      res.status(200).json(element);
    }
  } catch (err) {
    console.log(err);
    res.status(200).json(err);
  }
};
