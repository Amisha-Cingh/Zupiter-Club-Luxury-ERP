const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zupiter_club';
const JWT_SECRET = process.env.JWT_SECRET || 'zupiter_super_secret_key_123';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'Elite Member' },
  membershipTier: { type: String, default: 'Platinum VIP' },
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  username: { type: String, required: true },
  facility: { type: String, required: true },
  date: { type: String, required: true },
  guests: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Auth Routes
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone, username, password } = req.body;
  if (!phone || !username || !password) {
    return res.status(400).json({ message: 'Saari details bharna zaroori hai.' });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Ye Username pehle se registered hai.' });
  }
  return res.status(200).json({ message: 'OTP bhej diya gaya hai. (Test OTP: 123456)' });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp, username, password } = req.body;
  if (otp !== '123456') {
    return res.status(400).json({ message: 'Galat OTP! Kripya sahi OTP enter karein.' });
  }
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, password, phone });
      await user.save();
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      message: 'User verified & saved to MongoDB!',
      token,
      user: { name: user.username, role: user.role, tier: user.membershipTier }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error: Data save nahi ho paya.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Username ya Password.' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      message: 'Login Successful!',
      token,
      user: { name: user.username, role: user.role, tier: user.membershipTier }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error during login.' });
  }
});

// Booking Routes
app.post('/api/bookings/create', async (req, res) => {
  const { username, facility, date, guests, amount } = req.body;
  try {
    const newBooking = new Booking({ username, facility, date, guests, amount });
    await newBooking.save();
    return res.status(200).json({ message: 'Booking confirmed successfully!', booking: newBooking });
  } catch (err) {
    return res.status(500).json({ message: 'Booking failed.' });
  }
});

app.get('/api/bookings/user/:username', async (req, res) => {
  try {
    const bookings = await Booking.find({ username: req.params.username }).sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch failed.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));