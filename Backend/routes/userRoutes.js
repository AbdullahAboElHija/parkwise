const express = require("express");
const userController = require("./../controllers/userController");

const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);

// Placeholder: replace with real user handlers in `controllers/userController.js`
router.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Users endpoint" });
});

module.exports = router;
