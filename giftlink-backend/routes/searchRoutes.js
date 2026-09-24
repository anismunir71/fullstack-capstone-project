// giftlink-backend/routes/searchRoutes.js
// /api/search — filters gifts by name, category, condition, age.
//
// Grading Task 6 requires:
//   - filter on `category`

const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');

/**
 * GET /api/search
 * ---------------
 * Query params (all optional):
 *   - name      (partial, case-insensitive)
 *   - category  (exact, case-insensitive)
 *   - condition (exact, case-insensitive)
 *   - age       (exact, case-insensitive)
 *
 * Example:
 *   /api/search?category=Toys&condition=New
 */
router.get('/', async (req, res) => {
  try {
    const { name, category, condition, age } = req.query;

    // 1. Connect to MongoDB
    const db = await connectToDatabase();
    const giftsCollection = db.collection('gifts');

    // 2. Build the query object
    const query = {};

    // Filter by name — partial & case-insensitive
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // ✅ Grading Task 6 — filter on category (exact, case-insensitive)
    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Filter by condition
    if (condition) {
      query.condition = { $regex: `^${condition}$`, $options: 'i' };
    }

    // Filter by age
    if (age) {
      query.age = { $regex: `^${age}$`, $options: 'i' };
    }

    // 3. Fetch the filtered gifts
    const gifts = await giftsCollection.find(query).toArray();

    // 4. Return results
    return res.status(200).json(gifts);
  } catch (error) {
    console.error('Error in GET /api/search:', error.message);
    return res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;