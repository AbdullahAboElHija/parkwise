const express = require("express");
const parkingController = require("./../controllers/parkingController");

// TODO AUTHORIZATION
//const authController = require("./../controllers/authController"); // Assuming you have an auth controller

const router = express.Router();

// 1. PUBLIC / RENTER ROUTES
router.route("/top-rated").get(parkingController.getTopRatedParkings);

// The main route handles both search (query params) and simple listing
router.route("/")
    .get(parkingController.getAllParkings)
    // OWNER: Route for creating a new slot (requires being logged in)
    .post(
        parkingController.mockProtect,// TODO AUTHORIZATION authController.protect, // Middleware to ensure user is logged in
        parkingController.createParking
    );

// 2. OWNER MANAGEMENT & SINGLE RESOURCE
router.route("/my-listings")
    .get(
        parkingController.mockProtect,// TODO AUTHORIZATION authController.protect, 
        parkingController.getOwnerParkings);

router.route("/:id")
    // RENTER: Get single parking slot details
    .get(parkingController.getParking) 
    // OWNER: Update a specific listing (Requires protection AND ownership check)
    .patch(
        parkingController.mockProtect,// TODO AUTHORIZATION authController.protect, 
        parkingController.updateParking
    )
    // OWNER: Delete a specific listing (Requires protection AND ownership check)
    .delete(
        parkingController.mockProtect,// TODO AUTHORIZATION authController.protect, 
        
        parkingController.deleteParking
    );

module.exports = router;