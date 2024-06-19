const express = require("express");
const {
  createProduct,
  fetchProduct,
  fetchProductBySearch,
  updateProductById,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
router
  .post("/createProduct", createProduct)
  .get("/fetchProduct", fetchProduct)
  .get("/fetchProductBySearch", fetchProductBySearch)
  .delete("/deleteProduct/:id", deleteProduct)
  .patch("/updateProductById/:id", updateProductById);
exports.router = router;
