const express = require("express");
const {
  fetchUser,
  deleteUser,
  updateUserById,
} = require("../controllers/userController");
const router = express.Router();
router
  .get("/fetchUser", fetchUser)
  .delete("/deleteUser/:id", deleteUser)
  .patch("/updateUserById/:id", updateUserById);
exports.router = router;
