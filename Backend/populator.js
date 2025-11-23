const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Schema } = mongoose;

// 1. CONNECTION STRING
// Replace this with your actual MongoDB connection string
const MONGO_URI = process.env.DATABASE_HOST; 

// ==========================================
// TEMPORARY SCHEMAS (Matches your design)
// ==========================================
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  // ... keeping it simple for the seeder
});

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
        state: String,
        zip: String,
        country: String
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
    pricePerDay: { type: Number, required: true },
    currency: { type: String, default: 'USD' },

    // --- Stats (For Search & Owner Dashboard) ---
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true }, // Owner can toggle visibility

    createdAt: { type: Date, default: Date.now }
});


const User = mongoose.model('user', userSchema);
const ParkingSlot = mongoose.model('parking', parkingSchema);

// ==========================================
// THE POPULATION LOGIC
// ==========================================
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔌 Connected to MongoDB...');

    // 1. CLEAR OLD DATA
  //  console.log('🧹 Clearing old data...');
  //  await User.deleteMany({});
   // await ParkingSlot.deleteMany({});

    // 2. CREATE A DUMMY OWNER
    console.log('👤 Creating a dummy owner...');
    const owner = await User.create({
      fullName: "John Landlord",
      email: "owner@example.com",
    });

    // 3. CREATE PARKING SLOTS (Updated to match your Schema)
    console.log('🚗 Creating parking slots...');
    const parkingSlots = [
      {
        owner: owner._id,
        name: "Downtown Secure Garage",
        description: "24/7 security, very close to the central station.",
        address: {
          street: "123 Market St",
          city: "San Francisco",
          state: "CA",
          zip: "94103",          // <--- Added ZIP
          country: "USA"
        },
        location: {
          type: "Point",
          coordinates: [-122.4194, 37.7749] 
        },
        parkingType: "Garage",
        features: ["CCTV", "Gated", "Covered"],
        tags: ["Secure", "City Center"], // <--- Added TAGS
        pricePerDay: 25.00,
        currency: "USD",
        averageRating: 4.8,
        reviewCount: 12,
        totalBookings: 45,
        isActive: true,
        photos: ["https://placehold.co/600x400/png"]
      },
      {
        owner: owner._id,
        name: "Sunny Driveway Spot",
        description: "Wide driveway, fits SUVs. Quiet neighborhood.",
        address: {
          street: "45 Maple Ave",
          city: "San Jose",
          state: "CA",
          zip: "95110",          // <--- Added ZIP
          country: "USA"
        },
        location: {
          type: "Point",
          coordinates: [-121.8863, 37.3382]
        },
        parkingType: "Driveway",
        features: ["EV Charging", "Instant Book"],
        tags: ["Cheap", "Quiet"],    // <--- Added TAGS
        pricePerDay: 15.50,
        currency: "USD",
        averageRating: 4.2,
        reviewCount: 5,
        totalBookings: 8,
        isActive: true,
        photos: ["https://placehold.co/600x400/png"]
      },
      {
        owner: owner._id,
        name: "Airport Long-term Lot",
        description: "Cheapest option near the airport. Shuttle included.",
        address: {
          street: "88 Runway Blvd",
          city: "Oakland",
          state: "CA",
          zip: "94621",          // <--- Added ZIP
          country: "USA"
        },
        location: {
          type: "Point",
          coordinates: [-122.2711, 37.8044]
        },
        parkingType: "Lot",
        features: ["Open Air", "24/7 Access"],
        tags: ["Airport", "Long Term"], // <--- Added TAGS
        pricePerDay: 10.00,
        currency: "USD",
        averageRating: 3.5,
        reviewCount: 20,
        totalBookings: 102,
        isActive: true,
        photos: ["https://placehold.co/600x400/png"]
      }
    ];

    await ParkingSlot.insertMany(parkingSlots);

    console.log('✅ Database populated successfully!');
    console.log(`   - Created 1 Owner (${owner._id})`);
    console.log(`   - Created 3 Parking Slots in 'parkings' collection`);

    // 4. DISCONNECT
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();