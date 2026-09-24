// giftlink-backend/routes/authRoutes.js
// Placeholder — fully implemented in Module 4 (register, login, update).

const express = require('express');
const router = express.Router();

// Module 4 will fill in:
//   POST /api/auth/register
//   POST /api/auth/login
//   PUT  /api/auth/update

router.post('/register', (_req, res) => {
  res.status(501).json({ message: 'Register — to be implemented in Module 4' });
});

router.post('/login', (_req, res) => {
  res.status(501).json({ message: 'Login — to be implemented in Module 4' });
});

router.put('/update', (_req, res) => {
  res.status(501).json({ message: 'Update — to be implemented in Module 4' });
});

module.exports = router;