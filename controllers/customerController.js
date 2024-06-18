const { Customer } = require("../models/customerModel");

exports.createCustomer = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.housingComplex ||
      !req.body.phoneNumber ||
      !req.body.flatNumber
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const customer = new Customer({
      ...req.body,
    });
    const doc = await customer.save();
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchCustomerBySearch = async (req, res) => {
  const keyword = req.query.search
    ? { phoneNumber: { $regex: req.query.search } }
    : {};
  const customer = await Customer.find(keyword, {
    name: 1,
    housingComplex: 1,
    phoneNumber: 1,
    flatNumber: 1,
  });
  res.status(200).json(customer);
};

exports.fetchCustomer = async (req, res) => {
  try {
    const customer = await Customer.find({}).exec();
    res.status(200).json(customer);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
