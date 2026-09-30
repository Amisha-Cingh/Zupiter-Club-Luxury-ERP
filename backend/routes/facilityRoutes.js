const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');

// Get All Facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// Add New Facility
router.post('/add', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newFacility = new Facility({ name, price, category });
    await newFacility.save();
    res.status(201).json(newFacility);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add facility' });
  }
});

// Update Facility Price
router.put('/update/:id', async (req, res) => {
  try {
    const { price } = req.body;
    const updated = await Facility.findByIdAndUpdate(req.params.id, { price }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update facility' });
  }
});

// Delete Facility
// DELETE FACILITY BY ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Facility.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Facility deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;