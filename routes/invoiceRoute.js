const express = require("express");
const {
  createInvoice,
  fetchInvoice,
  generatePDF,
} = require("../controllers/invoiceController");
const router = express.Router();
router
  .post("/createInvoice", createInvoice)
  .get("/fetchInvoice", fetchInvoice)
  .get("/generatePDF/:id", generatePDF);
exports.router = router;
