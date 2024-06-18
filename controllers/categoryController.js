const { Category } = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const category = new Category({
      ...req.body,
    });
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchCategory = async (req, res) => {
  try {
    const category = await Category.find({}).exec();
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
