const express = require("express");
const {
  createCategory,
  fetchCategory,
} = require("../controllers/categoryController");
const router = express.Router();
router
  .post("/createCategory", createCategory)
  .get("/fetchCategory", fetchCategory);
exports.router = router;
