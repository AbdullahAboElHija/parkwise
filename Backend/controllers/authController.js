const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const bcrypt = require("bcrypt");

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


