const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Contract = require('../models/Contract');

// Get ERP Overview Stats
router.get('/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalContracts = await Contract.countDocuments();
    
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, item) => {
      const isCancelled = item.status && item.status.toLowerCase().includes('cancel');
      if (isCancelled) {
        const refund = item.refundAmount || ((item.amount || 0) * 0.8);
        return sum + ((item.amount || 0) - refund);
      }
      return sum + (item.amount || 0);
    }, 0);

    res.json({
      totalBookings,
      totalContracts,
      totalRevenue,
      recentBookings: bookings.slice(-5).reverse()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load admin stats' });
  }
});

// Cancel Booking Endpoint
router.delete('/booking/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;