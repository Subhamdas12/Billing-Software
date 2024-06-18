const express = require("express");
const {
  createProduct,
  fetchProduct,
  fetchProductBySearch,
} = require("../controllers/productController");
const router = express.Router();
router
  .post("/createProduct", createProduct)
  .get("/fetchProduct", fetchProduct)
  .get("/fetchProductBySearch", fetchProductBySearch);
exports.router = router;
