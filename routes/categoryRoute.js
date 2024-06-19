const express = require("express");
const {
  createCategory,
  fetchCategory,
  deleteCategory,
  updateCategoryById,
} = require("../controllers/categoryController");
const router = express.Router();
router
  .post("/createCategory", createCategory)
  .get("/fetchCategory", fetchCategory)
  .delete("/deleteCategory/:id", deleteCategory)
  .patch("/updateCategoryById/:id", updateCategoryById);
exports.router = router;
