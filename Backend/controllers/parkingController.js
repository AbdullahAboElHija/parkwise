const Parking = require("../models/parkingModel");

// FOR TESTING PURPOSES ONLY
// REMOVE WHEN AUTHENTICATION IS IMPLEMENTED
const MOCK_OWNER_ID = '66a6a02b1234567890abcdef';

exports.mockProtect = (req, res, next) => {
    // 1. Manually inject the user object onto the request
    req.user = { id: MOCK_OWNER_ID }; 
    // 2. Continue to the next controller function
    next(); 
};
// Helper function to handle common error responses
const sendError = (res, statusCode, message, err) => {
    console.error(message, err ? err : "");
    res.status(statusCode).json({
        status: "error",
        message: message,
        // Optionally include the error details in development mode
        error: process.env.NODE_ENV === 'development' && err ? err.message : undefined
    });
};

// ==============================================
// 1. RENTER ROUTES (SEARCH & READ)
// ==============================================

/**
 * @route GET /api/v1/parkings
 * @description Search for parkings. Supports GeoJSON queries, filtering, and sorting.
 * @access Public
 */
exports.getAllParkings = async (req, res) => {
    try {
        let query = Parking.find({ isActive: true }); // Only show active listings

        // --- 1. Geospatial Search ---
        // Example query: /api/v1/parkings?lat=37.77&lng=-122.41&distance=5
        if (req.query.lat && req.query.lng && req.query.distance) {
            const { lat, lng, distance } = req.query; // distance in kilometers

            // Convert distance from km to meters (for GeoJSON)
            const radiusInMeters = distance * 1000;

            query = query.where('location').near({
                center: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                maxDistance: radiusInMeters,
                spherical: true
            });

            // Note: The find() call below will execute this geospatial query
        }
        
        // --- 2. Filtering (e.g., parkingType, pricePerDay) ---
        // Basic filtering, you can expand this heavily
        if (req.query.parkingType) {
            query = query.where('parkingType').equals(req.query.parkingType);
        }
        if (req.query.priceMax) {
            query = query.where('pricePerDay').lte(parseFloat(req.query.priceMax));
        }

        // --- 3. Execution ---
        const parkings = await query;

        res.status(200).json({
            status: "success",
            results: parkings.length,
            data: parkings,
        });

    } catch (err) {
        sendError(res, 500, "Failed to fetch parking listings or process search query.", err);
    }
};

/**
 * @route GET /api/v1/parkings/top-rated
 * @description Get the top 5 highest-rated and most-reviewed parkings.
 * @access Public
 */
exports.getTopRatedParkings = async (req, res) => {
    try {
        const parkings = await Parking.find({ isActive: true })
            .sort({ averageRating: -1, reviewCount: -1 }) // Sort by rating descending, then by review count
            .limit(5); // Get only the top 5

        res.status(200).json({
            status: "success",
            results: parkings.length,
            data: parkings,
        });
    } catch (err) {
        sendError(res, 500, "Could not fetch top-rated parkings.", err);
    }
};

/**
 * @route GET /api/v1/parkings/:id
 * @description Get a specific parking slot's details.
 * @access Public
 */
exports.getParking = async (req, res) => {
    try {
        // We use .select('-owner') to prevent accidentally exposing owner details 
        // if they weren't explicitly populated in the response. 
        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return sendError(res, 404, "No parking slot found with that ID.");
        }

        res.status(200).json({
            status: "success",
            data: parking,
        });
    } catch (err) {
        sendError(res, 400, "Invalid parking ID format or database error.", err);
    }
};


// ==============================================
// 2. OWNER ROUTES (CRUD)
// ==============================================

/**
 * @route POST /api/v1/parkings
 * @description Create a new parking listing.
 * @access Authenticated (Owner)
 */
exports.createParking = async (req, res) => {
    try {
        // 1. Attach the owner's ID from the authenticated user (req.user is set by authController.protect)
        const newParking = await Parking.create({
            ...req.body,
            owner: req.user.id // <-- CRITICAL: Links the listing to the logged-in user
        });

        res.status(201).json({
            status: "success",
            message: "New parking slot created successfully.",
            data: newParking,
        });

    } catch (err) {
        // Handle validation errors (e.g., missing required fields, bad enum values)
        sendError(res, 400, "Invalid data provided for creating parking slot.", err);
    }
};

/**
 * @route GET /api/v1/parkings/my-listings
 * @description Get all listings owned by the logged-in user.
 * @access Authenticated (Owner)
 */
exports.getOwnerParkings = async (req, res) => {
    try {
        // Find all parkings where the owner field matches the logged-in user's ID
        const parkings = await Parking.find({ owner: req.user.id });

        res.status(200).json({
            status: "success",
            results: parkings.length,
            data: parkings,
        });
    } catch (err) {
        sendError(res, 500, "Could not fetch your listings.", err);
    }
};

/**
 * @route PATCH /api/v1/parkings/:id
 * @description Update details of a specific parking listing.
 * @access Authenticated (Owner & Authorized)
 */
exports.updateParking = async (req, res) => {
    try {
        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return sendError(res, 404, "No parking slot found with that ID to update.");
        }

        // --- AUTHORIZATION CHECK ---
        // Ensure the logged-in user is the owner of this parking slot
        // Convert IDs to strings for comparison
        if (parking.owner.toString() !== req.user.id) {
            return sendError(res, 403, "Forbidden. You do not own this parking slot.");
        }

        // Use findByIdAndUpdate to efficiently update the document
        const updatedParking = await Parking.findByIdAndUpdate(
            req.params.id, 
            req.body, { 
                new: true, // Return the updated document
                runValidators: true // Run schema validation on update
            }
        );

        res.status(200).json({
            status: "success",
            message: "Parking slot updated.",
            data: updatedParking,
        });
    } catch (err) {
        sendError(res, 400, "Update failed. Check validation or ID.", err);
    }
};

/**
 * @route DELETE /api/v1/parkings/:id
 * @description Delete/Deactivate a parking listing.
 * @access Authenticated (Owner & Authorized)
 */
exports.deleteParking = async (req, res) => {
    try {
        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return sendError(res, 404, "No parking slot found with that ID to delete.");
        }

        // --- AUTHORIZATION CHECK ---
        if (parking.owner.toString() !== req.user.id) {
            return sendError(res, 403, "Forbidden. You do not own this parking slot.");
        }
        
        // Option 1: Hard Delete (use sparingly, risks losing data history)
        // await Parking.findByIdAndDelete(req.params.id);

        // Option 2 (Recommended): Soft Delete/Deactivation (Sets isActive: false)
        await Parking.findByIdAndUpdate(req.params.id, { isActive: false });

        res.status(204).json({
            status: "success",
            data: null, // 204 means no content
            message: "Parking slot deactivated successfully (soft-deleted)."
        });
    } catch (err) {
        sendError(res, 400, "Deletion failed. Check ID.", err);
    }
};