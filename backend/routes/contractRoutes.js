const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');

// 1. Get All Contracts
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ issueDate: -1 });
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// 2. Save Contract to MongoDB
router.post('/save-contract', async (req, res) => {
  const { username, signatureDataUrl } = req.body;

  if (!username || !signatureDataUrl) {
    return res.status(400).json({ error: 'Username and signature are required' });
  }

  try {
    const newContract = new Contract({
      username,
      signatureDataUrl
    });

    await newContract.save();
    res.status(201).json({ message: 'Contract successfully saved in database!', contract: newContract });
  } catch (error) {
    console.error('Error saving contract:', error);
    res.status(500).json({ error: 'Failed to save contract in database' });
  }
});

module.exports = router;