const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const { promisify } = require("util"); // Built-in node module
//catchAsync
exports.signUp = async (req, res) => {
  try {

    const newUser = await User.create({
      _id: req.body._id,
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: "User creation failed", error: err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check the email and password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ status: "fail", message: "User not found" });
    }
    //check the password and the email if they are correct
    console.log(user);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: "fail", message: "Incorrect password" });
    }
    //create token and send it to the client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "Login failed", error: err });
  }



}


exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    // We use promisify so we can use 'await' instead of a callback
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    // (If the user was deleted after the token was issued, the token should be invalid)
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer does exist.",
      });
    }

    // 4) GRANT ACCESS TO PROTECTED ROUTE
    // We put the user info onto the request object so the next controller has access to it
    req.user = currentUser;
    next();
    
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token or authorization failed",
      error: err 
    });
  }
};