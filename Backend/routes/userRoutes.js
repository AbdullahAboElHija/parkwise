const express = require("express");
const userController = require("./../controllers/userController");

const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

// Placeholder: replace with real user handlers in `controllers/userController.js`
router.get("/", userController.getAllUsers);

module.exports = router;