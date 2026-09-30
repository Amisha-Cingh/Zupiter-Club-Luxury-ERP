const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  role: { type: String, default: "guest" }
}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema); // Collection name: guests