const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  // Membership Tier Details
  tierName: { type: String },
  tierPrice: { type: String },

  // Basic Personal Details
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },

  // UPSC Style Comprehensive Identification
  dob: { type: String },
  gender: { type: String },
  nationality: { type: String, default: 'Indian' },
  fatherName: { type: String },
  passportNo: { type: String },
  occupation: { type: String },
  annualIncome: { type: String },
  emergencyContact: { type: String },
  address: { type: String },

  // Banking & Payment Details
  accountHolder: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },

  // Digital Signature & Status
  signatureDataUrl: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Active VIP' }
});

module.exports = mongoose.model('Contract', ContractSchema);