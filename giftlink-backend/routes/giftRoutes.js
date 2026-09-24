// giftlink-backend/routes/giftRoutes.js
// Routes for /api/gifts and /api/gifts/:id
//
// Grading Task 5 requires:
//   - uses connectToDatabase() to connect to MongoDB
//   - serves  GET /api/gifts
//   - serves  GET /api/gifts/:id

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../models/db');

/**
 * GET /api/gifts
 * --------------------
 * Connect to MongoDB → access the "gifts" collection →
 * fetch all documents → return them as a JSON array.
 */
router.get('/', async (req, res) => {
  try {
    // 1. Connect to MongoDB
    const db = await connectToDatabase();

    // 2. Access the collection
    const giftsCollection = db.collection('gifts');

    // 3. Fetch all gifts
    const gifts = await giftsCollection.find({}).toArray();

    // 4. Return the gifts array
    return res.status(200).json(gifts);
  } catch (error) {
    console.error('Error in GET /api/gifts:', error.message);
    return res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

/**
 * GET /api/gifts/:id
 * --------------------
 * Fetch a single gift by its MongoDB _id.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid gift ID format' });
    }

    // 1. Connect to MongoDB
    const db = await connectToDatabase();

    // 2. Access the collection
    const giftsCollection = db.collection('gifts');

    // 3. Find the gift by _id
    const gift = await giftsCollection.findOne({ _id: new ObjectId(id) });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // 4. Return the gift
    return res.status(200).json(gift);
  } catch (error) {
    console.error(`Error in GET /api/gifts/${req.params.id}:`, error.message);
    return res.status(500).json({ error: 'Failed to fetch gift' });
  }
});

module.exports = router;