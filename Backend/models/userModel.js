const mongoose = require("mongoose");
const { Schema } = mongoose;

// ==========================================
// User Schema
// ==========================================
const userSchema = new Schema({
    
    
    
    // --- Auth & Basic Info ---
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Hash this before saving
    phoneNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },


    
    // --- Profile Image ---
    avatarUrl: { type: String },




    // --- Payment Info ---
    // DO NOT store raw card details. Store the token/ID from Stripe/PayPal
    stripeCustomerId: { type: String },
    paymentMethods: [{
        provider: { type: String, default: 'Stripe' },
        last4: String,
        token: String
    }],

    // --- Renter Stats (Booking History) ---
    // We reference the Booking model, but we don't need to embed the whole history here.
    // We can query Bookings where { renter: user._id }



    // --- Owner Stats (Dashboard Data) ---
    // We keep these here for fast dashboard rendering
    ownerStats: {
        totalEarnings: { type: Number, default: 0 },
        totalBookingsReceived: { type: Number, default: 0 },
        activeListingsCount: { type: Number, default: 0 },
        averageOwnerRating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 }
    },

    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("users", userSchema);
