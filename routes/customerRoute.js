const express = require("express");
const {
  createCustomer,
  fetchCustomerBySearch,
  fetchCustomer,
} = require("../controllers/customerController");

const router = express.Router();
router
  .post("/createCustomer", createCustomer)
  .get("/fetchCustomerBySearch", fetchCustomerBySearch)
  .get("/fetchCustomer", fetchCustomer);
exports.router = router;
