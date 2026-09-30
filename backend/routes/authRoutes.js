const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Guest = require("../models/Guest");

// 1. ADMIN LOGIN / SIGNUP ROUTE
router.post("/admin-login", async (req, res) => {
  const { username, password, secretKey, adminSecretKey } = req.body;
  const keyToValidate = secretKey || adminSecretKey;

  // 1. Secret Key Check
  if (!keyToValidate || keyToValidate.trim() !== "ZUPITER_ADMIN_2026") {
    return res.status(403).json({
      success: false,
      message: "Invalid Secret Key!"
    });
  }

  try {
    let admin = await Admin.findOne({ username });

    // 2. Agar Admin exist nahi karta, toh naya banaayein
    if (!admin) {
      admin = new Admin({ username, password, role: "admin" });
      await admin.save();
    } else {
      // 3. Agar password match nahi ho raha, toh use update kar dein (Override Fix)
      if (admin.password !== password) {
        admin.password = password; // Fast fix for testing
        await admin.save();
      }
    }

    // 4. Token generate karein
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "YOUR_JWT_SECRET",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin Logged In Successfully!",
      token,
      user: { id: admin._id, username: admin.username, role: "admin" }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}); 

// 2. GUEST OTP VERIFY ROUTE
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (otp !== "123456") {
    return res.status(400).json({ success: false, message: "Invalid OTP!" });
  }

  try {
    let guest = await Guest.findOne({ phone });

    if (!guest) {
      // Direct Guest collection me save hoga
      guest = new Guest({ phone, role: "guest" });
      await guest.save();
    }

    const token = jwt.sign({ id: guest._id, role: "guest" }, "YOUR_JWT_SECRET", { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      token,
      user: { id: guest._id, phone: guest.phone, role: "guest" }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;