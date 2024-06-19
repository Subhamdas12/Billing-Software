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

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const updateCategory = await category.save();
    res.status(200).json(updateCategory);
  } catch (err) {
    console.log(err);
    res.status(200).json(err);
  }
};
