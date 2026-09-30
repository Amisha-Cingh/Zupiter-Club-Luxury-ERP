const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. MUST BE FIRST: Fetch all bookings for My Reservations tab
router.get("/my-bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Fetch bookings by username
router.get('/:username', async (req, res) => {
  try {
    const bookings = await Booking.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 3. Create New Booking
router.post('/book', async (req, res) => {
  try {
    const { username, facility, date, guests, amount } = req.body;

    if (!username || !facility || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBooking = new Booking({
      username,
      facility,
      date,
      guests: Number(guests) || 1,
      amount: Number(amount) || 0,
      status: 'Confirmed'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking Successful!', booking: newBooking });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ error: 'Server error while booking' });
  }
});

// 4. Cancel / Delete Booking
router.delete('/cancel/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// 5. Cancel Booking Handler (supports multiple URL formats)
const cancelBookingHandler = async (req, res) => {
  try {
    const bookingId = req.params.id;
    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const refundAmt = (booking.amount || 0) * 0.8;
    booking.status = req.body.status || "Cancelled (Refunded 80%)";
    booking.refundAmount = refundAmt;

    const updatedBooking = await booking.save();

    return res.status(200).json({
      success: true,
      booking: updatedBooking,
      message: 'Booking canceled and refunded successfully'
    });
  } catch (err) {
    console.error('Cancel Route Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to cancel booking: ' + err.message });
  }
};

router.put('/cancel/:id', cancelBookingHandler);
router.put('/:id/cancel', cancelBookingHandler);
router.put('/update/:id', cancelBookingHandler);
router.put('/:id', cancelBookingHandler);
router.patch('/cancel/:id', cancelBookingHandler);
router.patch('/:id/cancel', cancelBookingHandler);
router.patch('/update/:id', cancelBookingHandler);
router.patch('/:id', cancelBookingHandler);

module.exports = router;