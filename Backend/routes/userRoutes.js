const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();

// Placeholder: replace with real user handlers in `controllers/userController.js`
router.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Users endpoint" });
});

module.exports = router;
