const { generatePdf } = require("../helper/services");
const { Invoice } = require("../models/invoiceModel");

exports.createInvoice = async (req, res) => {
  try {
    if (
      !req.body.user ||
      !req.body.customer ||
      !req.body.product ||
      !req.body.rate ||
      !req.body.quantity
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const invoice = new Invoice({
      ...req.body,
    });
    const doc = await invoice.save();
    const element = await Invoice.findById(doc.id)
      .populate("customer")
      .populate("product");
    const downloadLink = generatePdf(element);

    res.status(201).json({
      link: downloadLink,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.find({}).exec();
    res.status(200).json(invoice);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.generatePDF = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const invoice = await Invoice.findById(invoiceId)
      .populate("customer")
      .populate("product");
    generatePdf(invoice);
  } catch (err) {}
};

exports.fetchInvoice = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "Admin") {
      const invoice = await Invoice.find({})
        .populate("customer")
        .populate("product")
        .exec();
      res.status(200).json(invoice);
    } else {
      console.log(user);
      const invoice = await Invoice.find({ user: user.id })
        .populate("customer")
        .populate("product")
        .exec();

      res.status(200).json(invoice);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
