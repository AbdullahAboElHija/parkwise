const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // since your demo data uses "p1", "p2", "p3"
      required: true,
    },

    title: {
      type: String,
      required: [true, "A parking spot must have a title"],
      trim: true,
    },

    ownerId: {
      type: String,
      required: [true, "Parking must belong to an owner"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    coordinates: {
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },

    price: {
      hour: {
        type: Number,
        required: [true, "Hourly price is required"],
      },
      day: {
        type: Number,
        required: false,
      },
      month: {
        type: Number,
        required: false,
      },
    },

    type: {
      type: String,
      enum: ["covered", "open", "underground"],
      required: true,
    },

    evCharger: {
      type: Boolean,
      default: false,
    },

    accessible: {
      type: Boolean,
      default: false,
    },

    isInstantBooking: {
      type: Boolean,
      default: false,
    },

    width: {
      type: Number,
      required: false,
    },

    length: {
      type: Number,
      required: false,
    },

    images: {
      type: [String], // array of URLs
      default: [],
    },

    rules: {
      type: String,
      default: "",
    },

    availability: {
      type: String, // e.g., "24/7" or "08:00 - 23:00"
      default: "24/7",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

module.exports = mongoose.model("Parking", parkingSchema);
