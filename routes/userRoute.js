const express = require("express");
const { fetchUser } = require("../controllers/userController");
const router = express.Router();
router.get("/fetchUser", fetchUser);
exports.router = router;
