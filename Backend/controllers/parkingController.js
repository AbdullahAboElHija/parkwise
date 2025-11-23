const Parking = require("../models/parkingModel");

exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({});
    res.status(200).json({
      status: "success",
      results: parkings.length,
      data: parkings,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Could not fetch parkings" });
  }
};
