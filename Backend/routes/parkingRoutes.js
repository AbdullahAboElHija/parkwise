const express = require("express");
const parkingController = require("./../controllers/parkingController");

// The authController is referenced here as a reminder for future implementation.
// For now, we use parkingController.mockProtect for temporary testing.

const router = express.Router();


// 1. PUBLIC / RENTER ROUTES

/**
 * @route GET /api/v1/parkings/top-rated
 * @description Get the top 5 highest-rated active parking slots.
 * @access Public
 */
router.route("/top-rated")
    .get(parkingController.getTopRatedParkings);


/**
 * @route /api/v1/parkings
 */
router.route("/")
    /**
     * @route GET /api/v1/parkings
     * @description Search for and retrieve all active parking slots. Supports GeoJSON and filtering via query parameters.
     * @access Public
     */
    .get(parkingController.getAllParkings)
    
    /**
     * @route POST /api/v1/parkings
     * @description Create a new parking listing. The owner field is automatically set to the authenticated user's ID.
     * @access Owner (Requires Authentication)
     */
    .post(
        parkingController.mockProtect, // TEMP: Simulates authController.protect
        parkingController.createParking
    );


/* 2. OWNER MANAGEMENT & SINGLE RESOURCE */

/**
 * @route GET /api/v1/parkings/my-listings
 * @description Get all parking listings owned by the logged-in user.
 * @access Owner (Requires Authentication)
 */
 router.route("/my-listings")
    .get(
        parkingController.mockProtect, // TEMP: Simulates authController.protect
        parkingController.getOwnerParkings
    );


/**
 * @route /api/v1/parkings/:id
 */
router.route("/:id")

    /**
     * @route GET /api/v1/parkings/:id
     * @description Retrieve the details of a single parking slot by its ID.
     * @access Public
     */
    .get(parkingController.getParking) 

    /**
     * @route PATCH /api/v1/parkings/:id
     * @description Update a specific parking listing. Requires the user to be the owner of the listing.
     * @access Owner (Requires Authentication & Authorization)
     */
    .patch(
        parkingController.mockProtect, // TEMP: Simulates authController.protect
        parkingController.updateParking
    )

    /**
     * @route DELETE /api/v1/parkings/:id
     * @description Deactivate (soft delete) a parking listing. Requires the user to be the owner of the listing.
     * @access Owner (Requires Authentication & Authorization)
     */
    .delete(
        parkingController.mockProtect, // TEMP: Simulates authController.protect
        parkingController.deleteParking
    );

module.exports = router;