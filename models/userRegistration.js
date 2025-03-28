const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  email: {
    type: String,
    required:[true, 'Email is required.'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address.']
  },
  name: {
    type: String,
    required:  [true, 'name is required.'],
    trim: true
  },
  password: {
    type: String,
    required:  false,
    trim: true
  },
  googleId: { type: String, required: false },
  avatar: { type: String },

},{timestamps:true});

const auth = new mongoose.model("auth", registerSchema);

module.exports = auth;