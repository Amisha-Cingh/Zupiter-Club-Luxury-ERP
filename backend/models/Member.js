const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberId: { type: String, required: true, unique: true },
  membershipTier: { type: String, enum: ['Silver', 'Gold', 'Diamond', 'Platinum'], required: true },
  durationYears: { type: Number, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  gender: { type: String, required: true },
  signatureDataUrl: { type: String, required: true },
  contractPdfUrl: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Completed' },
  transactionId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);