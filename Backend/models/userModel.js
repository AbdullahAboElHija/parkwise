const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  // MONGO DB AUTOMATICALLY ASSIGNS ObjectID as _id field for entries in table 
  // (more efficiency too for indexing)
  // _id: {
  //   type: String, // assuming user IDs are strings like "999999999", "u2"
  //   required: true,
  // },

  
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    select: false,
  },
});

userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
});



const User = mongoose.model("User", userSchema);

module.exports = User;
