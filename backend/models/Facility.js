const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);