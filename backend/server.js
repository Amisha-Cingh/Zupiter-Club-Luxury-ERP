const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// 1. Initialize Express App First
const app = express();

// 2. Middlewares (10MB limit for Base64 Signatures)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. Import Routes
const authRoutes = require("./routes/authRoutes");
const contractRoutes = require("./routes/contractRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facilityRoutes = require("./routes/facilityRoutes");

// 4. Import Models
const Contract = require("./models/Contract");

// 5. Direct Contract Routes (Supports both plural & singular URLs)
app.post(["/api/contracts", "/api/contract"], async (req, res) => {
  try {
    const newContract = new Contract(req.body);
    await newContract.save();
    
    res.status(201).json({
      success: true,
      message: "Membership Contract saved successfully in Database!",
      data: newContract
    });
  } catch (error) {
    console.error("Contract Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save contract data",
      error: error.message
    });
  }
});

// 6. Mount Other Routes
app.use("/api/auth", authRoutes);
app.use("/api/contract", contractRoutes);

app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/facilities", facilityRoutes);

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});