const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  facility: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Confirmed'
  },
  refundAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);