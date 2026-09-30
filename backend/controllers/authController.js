const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Send OTP Simulation
exports.sendOtp = async (req, res) => {
  try {
    const { phone, username } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });

    // Agar user nahi hai, toh new user create karein
    if (!user) {
      user = new User({
        phone: phone,
        // Agar body me username nahi aaya toh phone ke last 4 digits se default username banayein
        username: username || `User_${phone.slice(-4)}`,
        role: "viewer"
      });
      await user.save();
    }

    // Baaki OTP send karne ka code yahan...
    res.status(200).json({ success: true, message: "OTP sent successfully", user });

  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Verify OTP & Login
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user._id, phone: user.phone, role: user.role }
  });
};

// Admin Login with Secret Key
exports.adminLogin = async (req, res) => {
  try {
    const { username, password, adminSecretKey } = req.body;

    // Secret Key Verification
    const EXPECTED_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "ZUPITER_ADMIN_2026";
    if (adminSecretKey !== EXPECTED_SECRET_KEY) {
      return res.status(403).json({ success: false, message: "Invalid Admin Secret Key" });
    }

    // Check or create admin user
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({
        username: username,
        phone: "9999999999",
        role: "admin"
      });
      await user.save();
    } else if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    // Generate token / success response
    const token = jwt.sign 
      ? jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1d" })
      : "mock-admin-token";

    return res.status(200).json({
      success: true,
      message: "Admin Authenticated Successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};