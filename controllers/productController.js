const { Product } = require("../models/productModel");

exports.createProduct = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.rate ||
      !req.body.unit ||
      !req.body.category
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const product = new Product({
      ...req.body,
    });
    const doc = await product.save();
    const element = await Product.findById(doc.id).populate("category");
    res.status(201).json(element);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.fetchProduct = async (req, res) => {
  try {
    const product = await Product.find({}).populate("category");
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchProductBySearch = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search } },
          { shortKey: { $regex: req.query.search } },
        ],
      }
    : {};

  const product = await Product.find(keyword, {
    name: 1,
    rate: 1,
    unit: 1,
    shortKey: 1,
  }).populate("category");
  res.status(200).json(product);
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const updateProduct = await product.save();
    const element = await Product.findById(updateProduct.id).populate(
      "category"
    );
    res.status(200).json(element);
  } catch (err) {
    console.log(err);
    res.status(200).json(err);
  }
};
