const mongoose = require("mongoose");
const { Schema } = mongoose;


// ==========================================
// Parking Slot Schema (The Listing)
// ==========================================
const parkingSchema = new Schema(
  {
    
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },



    // --- Display Info ---
    name: { type: String, required: true, trim: true }, // e.g., "Downtown Secure Garage"
    description: { type: String },
    photos: [{ type: String }], // Array of URLs




    // --- Location (Critical for Map Search) ---
    address: {
        street: String,
        city: String,
        region: String,
        zip: String,
    },
    location: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: { type: [Number], required: true } // [Longitude, Latitude]
    },




    // --- Details & Features ---
    parkingType: {
        type: String,
        enum: ['Driveway', 'Garage', 'Street', 'Lot', 'Basement'],
        required: true
    },
    features: [{ type: String }], // e.g., ["CCTV", "Covered", "EV Charging", "Gated"]
    tags: [{ type: String }], // e.g., ["Cheap", "Near Airport", "Instant Book"]




    // --- Pricing ---
    prices: { hourly: Number, daily: Number, monthly:Number},
    currency: { type: String, default: 'USD' },




    // --- Stats (For Search & Owner Dashboard) ---
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true }, // Owner can toggle visibility

    createdAt: { type: Date, default: Date.now }
});

// Create 2dsphere index for location-based searching
parkingSchema.index({ location: '2dsphere' });


module.exports = mongoose.model("Parking", parkingSchema);
