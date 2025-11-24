const User = require("./../models/userModel");

//catchAsync
exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: "User creation failed", error: err });
  }
};


