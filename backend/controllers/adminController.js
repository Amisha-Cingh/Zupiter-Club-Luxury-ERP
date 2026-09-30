export const getAdminStats = async (req, res) => {
  try {
    // Database ke saare bookings fetch karein
    const allBookings = await Booking.find().sort({ createdAt: -1 });

    const totalRevenue = allBookings.reduce(
      (sum, b) => sum + (Number(b.amount) || Number(b.price) || 0),
      0
    );

    res.status(200).json({
      totalRevenue,
      totalBookings: allBookings.length,
      recentBookings: allBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};